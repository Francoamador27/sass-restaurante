# Plan: Ciclo de vida de Tenants — Eliminación segura + Pausa + Pantalla de bloqueo

## 1. Diagnóstico del estado actual

### Lo que SÍ funciona (cascades en DB)
Todas estas tablas tienen `CASCADE ON DELETE` en su FK `tenant_id` → se borran solos al eliminar el tenant:

| Tabla | Cascade |
|---|---|
| `doctor` | ✅ cascadeOnDelete |
| `patients` | ✅ cascadeOnDelete |
| `events` | ✅ cascadeOnDelete |
| `consult` | ✅ cascadeOnDelete |
| `odontograma` | ✅ cascadeOnDelete |
| `patologias` | ✅ cascadeOnDelete |
| `document` | ✅ cascadeOnDelete |
| `gastos` | ✅ cascadeOnDelete |
| `categorias_gastos` | ✅ cascadeOnDelete |
| `user_tenant` (pivot) | ✅ cascadeOnDelete |

### Lo que NO funciona
| Problema | Causa |
|---|---|
| Los `users` del tenant no se borran | `users.tenant_id` usa `nullOnDelete` → solo queda en null, el user sigue existiendo |
| El admin del tenant borrado puede loguearse | Sanctum tokens siguen válidos, user existe, `tenants` array vacío en login |
| Frontend no maneja `tenants: []` al loguearse | `useAuth` redirige a `/admin-dash` igual |
| No hay estado "pausado" | Solo existe `active` booleano, sin pantalla de bloqueo |
| `confirm()` nativo para borrar | Sin confirmación doble, sin opción de borrar admins |

---

## 2. Parte 1 — Eliminación segura con confirmación

### 2.1 Modal de confirmación en el frontend

Reemplazar el `confirm()` nativo por un modal con:

1. **Nombre del tenant** destacado
2. **Lista de lo que se borrará**: pacientes, doctores, citas, odontogramas, documentos, etc.
3. **Toggle**: "También eliminar las cuentas de usuario de los administradores"
   - Si está OFF → los users quedan en el sistema pero sin ningún tenant asignado
   - Si está ON → se borran los users que solo pertenecían a este tenant
4. **Input de confirmación**: "Escribe el nombre exacto del tenant para confirmar"
5. Botón habilitado solo cuando el nombre coincide exactamente

```jsx
// TenantDeleteModal.jsx (NUEVO)
const TenantDeleteModal = ({ tenant, onConfirm, onClose }) => {
    const [inputName, setInputName] = useState('');
    const [deleteAdmins, setDeleteAdmins] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isValid = inputName === tenant.name;

    const handleConfirm = async () => {
        setDeleting(true);
        await onConfirm({ deleteAdmins });
        setDeleting(false);
    };

    return (
        <Modal>
            {/* Header rojo */}
            <h3>Eliminar tenant: {tenant.name}</h3>

            {/* Lo que se borrará */}
            <WarningList items={[
                'Todos los pacientes y su historial clínico',
                'Todos los doctores y sus datos',
                'Todas las citas y eventos',
                'Todos los documentos y archivos',
                'Todos los odontogramas',
                'Todos los gastos y finanzas',
            ]} />

            {/* Toggle admins */}
            <Toggle
                label="También eliminar las cuentas de los administradores"
                hint="Solo borra usuarios que no pertenezcan a otra clínica"
                value={deleteAdmins}
                onChange={setDeleteAdmins}
            />

            {/* Input confirmación */}
            <label>Escribí "{tenant.name}" para confirmar:</label>
            <input value={inputName} onChange={e => setInputName(e.target.value)} />

            <Button disabled={!isValid || deleting} onClick={handleConfirm} variant="danger">
                {deleting ? 'Eliminando...' : 'Eliminar permanentemente'}
            </Button>
        </Modal>
    );
};
```

### 2.2 Backend — `TenantController::destroy`

```php
public function destroy(Request $request, Tenant $tenant)
{
    $deleteAdmins = $request->boolean('delete_admins', false);

    DB::transaction(function () use ($tenant, $deleteAdmins) {

        // Capturar user_ids ANTES de que el cascade los borre del pivot
        $userIds = DB::table('user_tenant')
            ->where('tenant_id', $tenant->id)
            ->pluck('user_id')
            ->toArray();

        // Invalidar tokens Sanctum de esos usuarios
        // (evita que sigan autenticados aunque el user exista)
        DB::table('personal_access_tokens')
            ->where('tokenable_type', 'App\\Models\\User')
            ->whereIn('tokenable_id', $userIds)
            ->delete();

        // Eliminar tenant → el CASCADE borra doctor, patients, events,
        // consult, odontograma, patologias, document, gastos,
        // categorias_gastos, user_tenant automáticamente
        $tenant->delete();

        // Borrar users que ya no pertenecen a ningún tenant
        // (siempre se borran los "huérfanos", independientemente de delete_admins)
        $huerfanos = DB::table('users')
            ->whereIn('id', $userIds)
            ->whereNotIn('id', DB::table('user_tenant')->select('user_id'))
            ->pluck('id');

        if ($deleteAdmins) {
            // Borrar todos los users de este tenant que no estén en otro
            User::whereIn('id', $huerfanos)->delete();
        } else {
            // Solo borrar los que no tienen ningún otro tenant (son "fantasmas" de todas formas)
            User::whereIn('id', $huerfanos)
                ->where('role', '!=', 'admin') // nunca borrar admins automáticamente sin confirmación
                ->delete();
        }
    });

    return response()->json(['message' => 'Tenant eliminado correctamente.']);
}
```

### 2.3 Parámetro de la request

```
DELETE /api/superadmin/tenants/{id}?delete_admins=1
// o con body JSON: { "delete_admins": true }
```

---

## 3. Parte 2 — Pausar tenant (bloqueo por pago)

### 3.1 Migración — columna `paused`

```php
// NUEVA migración
Schema::table('tenants', function (Blueprint $table) {
    $table->boolean('paused')->default(false)->after('active');
    $table->string('paused_reason')->nullable()->after('paused');
    // Motivo visible solo para el superadmin (ej: "Pendiente de pago - Abril 2026")
});
```

- `active = false` → tenant desactivado por el superadmin (comportamiento existente)
- `paused = true` → tenant suspendido por impago/falta de pago → muestra pantalla específica

### 3.2 `ResolveTenant` middleware — agregar chequeo de pausa

```php
// Después de encontrar el tenant, antes del $next($request):

if ($tenant->paused) {
    return response()->json([
        'blocked'   => true,
        'reason'    => 'tenant_paused',
        'message'   => 'Tu acceso ha sido suspendido.',
        'whatsapp'  => config('app.support_whatsapp', ''),
    ], 402); // 402 Payment Required — semánticamente correcto
}
```

### 3.3 `TenantController::update` — aceptar `paused`

```php
$data = $request->validate([
    'name'          => 'sometimes|string|max:255',
    'slug'          => 'sometimes|string|max:100|alpha_dash|unique:tenants,slug,' . $tenant->id,
    'plan'          => 'sometimes|string|in:basic,pro,enterprise',
    'active'        => 'sometimes|boolean',
    'paused'        => 'sometimes|boolean',          // ← NUEVO
    'paused_reason' => 'sometimes|nullable|string|max:255', // ← NUEVO
]);
$tenant->update($data);
```

### 3.4 `config/app.php` — agregar WhatsApp de soporte

```php
'support_whatsapp' => env('SUPPORT_WHATSAPP', ''),
```

```env
# .env
SUPPORT_WHATSAPP=5491112345678
```

### 3.5 Axios interceptor — capturar 402

```js
// src/config/axios.js
clienteAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 402 && error.response?.data?.blocked) {
            // Guardar info del bloqueo para mostrar la pantalla
            sessionStorage.setItem('TENANT_BLOCKED', JSON.stringify({
                whatsapp: error.response.data.whatsapp,
                message:  error.response.data.message,
            }));
            // Forzar re-render del AdminLayout
            window.dispatchEvent(new Event('tenant-blocked'));
        }
        return Promise.reject(error);
    }
);
```

### 3.6 `AdminLayout.jsx` — detectar bloqueo y mostrar pantalla

```jsx
const AdminLayout = () => {
    const { user, error } = UseAuth({ middleware: 'auth' });
    const navigate = useNavigate();
    const [blocked, setBlocked] = useState(() => {
        return !!sessionStorage.getItem('TENANT_BLOCKED');
    });

    // Escuchar evento de bloqueo lanzado por el interceptor
    useEffect(() => {
        const handler = () => setBlocked(true);
        window.addEventListener('tenant-blocked', handler);
        return () => window.removeEventListener('tenant-blocked', handler);
    }, []);

    useEffect(() => {
        if (user && user.role !== 'admin') navigate('/');
    }, [user, navigate]);

    if (!user && !error) return <p>Cargando...</p>;
    if (!user || user.role !== 'admin') return null;

    // Mostrar pantalla de bloqueo
    if (blocked) return <TenantBlockedScreen />;

    return (
        <div className="admin-layout">
            <AdminSidebar />
        </div>
    );
};
```

### 3.7 `TenantBlockedScreen.jsx` (NUEVO componente)

```jsx
const TenantBlockedScreen = () => {
    const info = JSON.parse(sessionStorage.getItem('TENANT_BLOCKED') || '{}');
    const { logout } = UseAuth({});

    const waUrl = info.whatsapp
        ? `https://wa.me/${info.whatsapp}?text=Hola, necesito reactivar mi cuenta en DentalCor`
        : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full text-center">

                {/* Ícono */}
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    🔒
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Cuenta suspendida
                </h1>
                <p className="text-slate-500 mb-8">
                    El acceso a tu clínica ha sido suspendido temporalmente.
                    Para reactivarlo, comunicate con soporte.
                </p>

                {waUrl && (
                    <a href={waUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold mb-4"
                        style={{ background: '#25D366' }}>
                        💬 Contactar por WhatsApp
                    </a>
                )}

                <br />
                <button onClick={logout}
                    className="text-sm text-slate-400 hover:text-slate-600 mt-4 transition">
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};
```

### 3.8 Frontend `TenantsList` — botón de pausa

Agregar columna/acción de pausa en la tabla de tenants del SuperAdmin:

```jsx
// En la fila de cada tenant, junto a Activo/Inactivo
<button onClick={() => handleTogglePaused(tenant)}
    title={tenant.paused ? 'Reanudar' : 'Pausar (bloquear acceso)'}
    className={tenant.paused ? 'text-amber-500' : 'text-slate-400'}>
    {tenant.paused ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
</button>
```

```js
const handleTogglePaused = async (tenant) => {
    const action = tenant.paused ? 'reanudar' : 'pausar';
    if (!confirm(`¿${action} el tenant "${tenant.name}"?`)) return;

    const { data } = await clienteAxios.put(`/api/superadmin/tenants/${tenant.id}`, {
        paused: !tenant.paused,
    });
    setTenants(prev => prev.map(t => t.id === data.id ? data : t));
};
```

---

## 4. Parte 3 — Manejar usuarios sin tenant al loguearse

En `useAuth.js`, después del login si `tenants.length === 0`:

```js
// En login(), luego de guardar el token:
if (receivedTenants.length === 0) {
    // No tiene ningún tenant activo → mostrar mensaje
    // Opción A: dejar que la pantalla de selección lo maneje con un estado vacío
    navigate('/select-tenant'); // TenantSelector maneja el caso vacío
    return;
}
```

En `TenantSelector.jsx`, manejar el caso de tenants vacíos:

```jsx
if (tenants.length === 0) {
    return (
        <EmptyState
            title="Sin clínicas asignadas"
            description="Tu cuenta no está asignada a ninguna clínica activa.
                         Contactá al administrador del sistema."
            action={<button onClick={logout}>Cerrar sesión</button>}
        />
    );
}
```

---

## 5. Archivos a modificar / crear

### Backend

| Acción | Archivo |
|---|---|
| CREAR | `database/migrations/XXXX_add_paused_to_tenants_table.php` |
| MODIFICAR | `app/Http/Controllers/SuperAdmin/TenantController.php` — `destroy` con cascade users + `update` con `paused` |
| MODIFICAR | `app/Http/Middleware/ResolveTenant.php` — chequeo de `paused` → 402 |
| MODIFICAR | `config/app.php` — `support_whatsapp` |
| MODIFICAR | `.env` — `SUPPORT_WHATSAPP=...` |

### Frontend

| Acción | Archivo |
|---|---|
| CREAR | `src/views/SuperAdmin/Tenants/TenantDeleteModal.jsx` |
| CREAR | `src/views/AdminDash/TenantBlockedScreen.jsx` |
| MODIFICAR | `src/views/SuperAdmin/Tenants/TenantsList.jsx` — reemplazar `confirm()`, agregar botón pausar |
| MODIFICAR | `src/layout/AdminLayout.jsx` — detectar bloqueo, mostrar `TenantBlockedScreen` |
| MODIFICAR | `src/config/axios.js` — interceptor response 402 |
| MODIFICAR | `src/hooks/useAuth.js` — manejar `tenants: []` al login |
| MODIFICAR | `src/views/TenantSelector.jsx` — estado vacío cuando no hay tenants |

---

## 6. Fases de implementación

### Fase 1 — Migración + backend pausar (5 min, sin romper nada)
1. Crear migración `add_paused_to_tenants_table`
2. Agregar `paused` + `paused_reason` a `TenantController::update`
3. Agregar `support_whatsapp` a `.env` y `config/app.php`
4. Correr `php artisan migrate`

### Fase 2 — ResolveTenant + axios interceptor (sin romper nada)
1. Agregar chequeo de `paused` en `ResolveTenant` → 402
2. Agregar interceptor de response 402 en `axios.js`
3. Probar: pausar un tenant desde Postman, verificar que devuelve 402

### Fase 3 — Pantalla de bloqueo frontend
1. Crear `TenantBlockedScreen.jsx`
2. Actualizar `AdminLayout.jsx`
3. Probar flujo completo: pausar desde SuperAdmin → admin ve pantalla bloqueada

### Fase 4 — Botón de pausa en TenantsList
1. Agregar botón Pausar/Reanudar en la tabla
2. Probar toggle desde UI

### Fase 5 — Borrado seguro con modal
1. Crear `TenantDeleteModal.jsx`
2. Actualizar `TenantController::destroy` con cascade de users
3. Probar borrado con `delete_admins=true` y `false`
4. Probar que tokens quedan invalidados

### Fase 6 — Manejar login sin tenants
1. Actualizar `useAuth.js`
2. Actualizar `TenantSelector.jsx` con estado vacío

---

## 7. Consideraciones

### Por qué `paused` y no usar `active = false`
- `active = false` ya existe y no muestra pantalla específica (solo devuelve 403 genérico)
- `paused = true` devuelve 402 con el número de WhatsApp → experiencia más clara para el cliente
- Semánticamente: `active` = el tenant existe y funciona; `paused` = existe pero está temporalmente bloqueado

### Tokens Sanctum al borrar tenant
Al borrar un tenant se invalidan los tokens de todos sus usuarios.
Esto garantiza que aunque el `User` quede en la DB, la sesión activa se corta inmediatamente.

### Cascade en DB vs cascade en código
Los registros clínicos (patients, events, doctor, etc.) se borran por FK CASCADE en MySQL — no hace falta código extra.
Los `users` NO tienen CASCADE porque son una entidad global (pueden pertenecer a múltiples tenants).
Por eso el borrado de users se hace explícitamente en el controlador.

### `sessionStorage` vs `localStorage` para el bloqueo
Se usa `sessionStorage` para que al recargar la página y hacer una nueva request, si el superadmin ya lo desbloqueó, el interceptor no devuelva 402 y `sessionStorage.TENANT_BLOCKED` se limpie automáticamente al inicio de la sesión.
