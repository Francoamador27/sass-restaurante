# Plan: Usuarios Multi-Tenant (Doctor / Admin en múltiples clínicas)

## 1. Diagnóstico del estado actual

### Problemas concretos

| Problema | Causa raíz |
|---|---|
| No se puede crear un doctor con el mismo email en dos tenants | `store()` valida `unique:users,email` globalmente |
| Un usuario solo puede pertenecer a un tenant | `users.tenant_id` es una FK directa (1→1) |
| `ResolveTenant` no sabe qué tenant quiere usar el usuario | Lee `$user->tenant_id` sin opción de elegir |
| El login no devuelve la lista de tenants del usuario | `AuthController::login` solo retorna el user |
| No hay checkbox de "también admin" al crear doctor | El rol admin se deriva solo de `rol = 1` |

### Esquema actual (simplificado)

```
users
  id | name | email | password | tenant_id (FK único) | role | rol

doctor
  idodc | user_id | tenant_id | nodoc | ...
```

---

## 2. Arquitectura objetivo

Un `User` puede pertenecer a **N tenants** con un **rol distinto por tenant**.  
Cada `doctor` record sigue siendo **per-tenant** (dos registros para el mismo médico en dos clínicas).  
La contraseña es **única** — comparten el mismo `users` record.

```
users
  id | name | email | password | role (superadmin/admin/user — solo para superadmin)
  ↳ SE ELIMINA tenant_id de aquí

user_tenant  ← TABLA PIVOT nueva
  id | user_id (FK) | tenant_id (FK) | role (enum: admin, doctor, secretary) | active

doctor
  idodc | user_id (FK) | tenant_id (FK) | nodoc | ...  ← sin cambios
```

### Flujo de login con múltiples tenants

```
POST /api/login
  → devuelve token + lista de tenants del usuario

Si tenants.length === 1  →  entra directo
Si tenants.length > 1   →  frontend muestra TenantSelector
                            usuario elige → se guarda en localStorage
                            todas las requests llevan X-Tenant-ID: {id}

ResolveTenant middleware
  → lee X-Tenant-ID del header
  → verifica que user_tenant exista para ese par (user_id, tenant_id)
  → inyecta tenant y tenant_id en el container de Laravel
```

---

## 3. Cambios en la Base de Datos

### Migración 1 — Crear tabla pivot `user_tenant`

```php
Schema::create('user_tenant', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
    $table->enum('role', ['admin', 'doctor', 'secretary'])->default('doctor');
    $table->boolean('active')->default(true);
    $table->timestamps();

    $table->unique(['user_id', 'tenant_id']); // un user una vez por tenant
    $table->index('tenant_id');
});
```

### Migración 2 — Migrar datos existentes y limpiar `users`

```php
// 1. Copiar relaciones actuales al pivot
DB::table('users')
    ->whereNotNull('tenant_id')
    ->whereNotIn('role', ['superadmin'])
    ->each(function ($user) {
        DB::table('user_tenant')->insertOrIgnore([
            'user_id'    => $user->id,
            'tenant_id'  => $user->tenant_id,
            'role'       => $user->role === 'admin' ? 'admin' : 'doctor',
            'active'     => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    });

// 2. Eliminar columna tenant_id de users
Schema::table('users', function (Blueprint $table) {
    $table->dropForeign(['tenant_id']);
    $table->dropColumn('tenant_id');
});
```

> **Nota:** `users.role` queda solo para distinguir `superadmin`. Para todos los demás,
> el rol dentro del tenant vive en `user_tenant.role`.

---

## 4. Cambios en el Backend (Laravel)

### 4.1 Modelo `User`

**Archivo:** `app/Models/User.php`

```php
// Quitar tenant_id de $fillable
// Agregar relación pivot:

public function tenants()
{
    return $this->belongsToMany(Tenant::class, 'user_tenant')
                ->withPivot('role', 'active')
                ->withTimestamps();
}

public function activeTenants()
{
    return $this->tenants()->wherePivot('active', true);
}

// Conveniencia: rol dentro de un tenant específico
public function roleInTenant(int $tenantId): ?string
{
    $pivot = $this->tenants->firstWhere('id', $tenantId);
    return $pivot?->pivot->role;
}

public function isAdminInTenant(int $tenantId): bool
{
    return $this->roleInTenant($tenantId) === 'admin';
}
```

### 4.2 Middleware `ResolveTenant`

**Archivo:** `app/Http/Middleware/ResolveTenant.php`

```php
public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();
    if (!$user) return response()->json(['message' => 'No autenticado'], 401);
    if ($user->isSuperAdmin()) return $next($request);

    // Leer tenant elegido por el frontend
    $tenantId = (int) $request->header('X-Tenant-ID');

    if (!$tenantId) {
        return response()->json(['message' => 'Falta X-Tenant-ID en el header'], 400);
    }

    // Verificar que el usuario realmente pertenece a ese tenant
    $pivot = DB::table('user_tenant')
        ->where('user_id', $user->id)
        ->where('tenant_id', $tenantId)
        ->where('active', true)
        ->first();

    if (!$pivot) {
        return response()->json(['message' => 'Acceso denegado a este tenant'], 403);
    }

    $tenant = Tenant::find($tenantId);
    if (!$tenant || !$tenant->active) {
        return response()->json(['message' => 'Tenant inactivo'], 403);
    }

    app()->instance('tenant', $tenant);
    app()->instance('tenant_id', $tenant->id);
    app()->instance('tenant_role', $pivot->role); // disponible para otros middlewares

    return $next($request);
}
```

### 4.3 Middleware `IsAdmin`

**Archivo:** `app/Http/Middleware/IsAdmin.php`

Actualmente comprueba `$user->role === 'admin'` o `$user->admin`.  
Debe pasar a leer el rol del tenant activo:

```php
public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();

    if ($user?->isSuperAdmin()) return $next($request);

    $role = app()->has('tenant_role') ? app('tenant_role') : null;

    if ($role !== 'admin') {
        return response()->json(['message' => 'Se requiere rol admin en este tenant'], 403);
    }

    return $next($request);
}
```

### 4.4 `AuthController::login`

**Archivo:** `app/Http/Controllers/AuthController.php`

El login debe devolver los tenants del usuario para que el frontend pueda mostrar el selector:

```php
public function login(LoginRequest $request)
{
    $data = $request->validated();

    if (!auth()->attempt($data)) {
        return response()->json(['errors' => 'Credenciales inválidas'], 422);
    }

    $user = Auth::user();

    // Cargar tenants activos con rol en cada uno
    $tenants = $user->activeTenants()
        ->select('tenants.id', 'tenants.name', 'tenants.slug')
        ->get()
        ->map(fn($t) => [
            'id'   => $t->id,
            'name' => $t->name,
            'slug' => $t->slug,
            'role' => $t->pivot->role,   // 'admin' | 'doctor' | 'secretary'
        ]);

    return response()->json([
        'token'   => $user->createToken('token')->plainTextToken,
        'user'    => $user,
        'tenants' => $tenants,   // ← NUEVO
    ]);
}
```

### 4.5 `DoctorController::store`

**Archivo:** `app/Http/Controllers/DoctorController.php`

Cambios clave:
1. Eliminar `unique:users,email` — el email puede repetirse entre tenants (el user es el mismo)
2. Agregar `is_admin` checkbox
3. Si ya existe un user con ese email → reutilizarlo (no crear uno nuevo)
4. Crear o actualizar el registro en `user_tenant`

```php
public function store(Request $request)
{
    $tenantId = app('tenant_id');

    $data = $request->validate([
        'nodoc'    => 'required|string|max:150',
        'apdoc'    => 'nullable|string|max:150',
        'email'    => 'required|email|max:255',
        'password' => 'nullable|string|min:6',   // nullable: puede ser usuario existente
        'is_admin' => 'boolean',                  // ← NUEVO checkbox
        'sexd'     => 'required|in:Masculino,Femenino,Otro',
        'ceddoc'   => 'nullable|string|max:50',
        'nomesp'   => 'nullable|string|max:150',
        'phd'      => 'nullable|string|max:50',
        'nacd'     => 'nullable|date',
        'color'    => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/'],
    ]);

    [$user, $doctor] = DB::transaction(function () use ($data, $tenantId) {

        // ── Buscar o crear el User ─────────────────────────────────────────
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            // Usuario nuevo — contraseña obligatoria
            if (empty($data['password'])) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'password' => 'La contraseña es obligatoria para un usuario nuevo.',
                ]);
            }
            $user = User::create([
                'name'     => trim(($data['nodoc'] ?? '') . ' ' . ($data['apdoc'] ?? '')),
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'role'     => 'user',
            ]);
        }
        // Si ya existe, no tocamos su contraseña

        // ── Verificar que no sea ya doctor en este tenant ──────────────────
        $yaExiste = Doctor::where('user_id', $user->id)->exists(); // TenantScope filtra por tenant_id
        if ($yaExiste) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Este médico ya existe en esta clínica.',
            ]);
        }

        // ── Crear o actualizar pivot user_tenant ───────────────────────────
        $role = ($data['is_admin'] ?? false) ? 'admin' : 'doctor';

        DB::table('user_tenant')->upsert(
            [
                'user_id'    => $user->id,
                'tenant_id'  => $tenantId,
                'role'       => $role,
                'active'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            ['user_id', 'tenant_id'],   // conflict keys
            ['role', 'active', 'updated_at']
        );

        // ── Crear Doctor ───────────────────────────────────────────────────
        $doctor = Doctor::create([
            'user_id' => $user->id,
            'nodoc'   => $data['nodoc'],
            'apdoc'   => $data['apdoc'] ?? null,
            'ceddoc'  => $data['ceddoc'] ?? null,
            'nomesp'  => $data['nomesp'] ?? null,
            'phd'     => $data['phd'] ?? null,
            'nacd'    => $data['nacd'] ?? null,
            'sexd'    => $data['sexd'],
            'color'   => $data['color'] ?? null,
            'fere'    => Carbon::now(),
        ]);

        return [$user, $doctor];
    });

    return response()->json(['message' => 'Doctor creado.', 'data' => compact('user', 'doctor')], 201);
}
```

### 4.6 Ruta nueva: `GET /api/user/tenants`

Para que el frontend pueda refrescar la lista de tenants sin hacer login de nuevo:

```php
// En routes/api.php — grupo auth:sanctum
Route::get('/user/tenants', function (Request $request) {
    $tenants = $request->user()->activeTenants()
        ->select('tenants.id', 'tenants.name', 'tenants.slug')
        ->get()
        ->map(fn($t) => [
            'id'   => $t->id,
            'name' => $t->name,
            'slug' => $t->slug,
            'role' => $t->pivot->role,
        ]);
    return response()->json(['tenants' => $tenants]);
});
```

---

## 5. Cambios en el Frontend (React)

### 5.1 `useAuth.js` — guardar `tenants` y `activeTenant`

**Archivo:** `src/hooks/useAuth.js`

```js
// Estado nuevo
const [tenants, setTenants]           = useState(() => JSON.parse(localStorage.getItem('TENANTS') || '[]'));
const [activeTenant, setActiveTenant] = useState(() => JSON.parse(localStorage.getItem('ACTIVE_TENANT') || 'null'));

// En login():
const { token, user, tenants } = data;
localStorage.setItem('AUTH_TOKEN', token);
localStorage.setItem('TENANTS', JSON.stringify(tenants));

// Si tiene un solo tenant → seleccionarlo automáticamente
if (tenants.length === 1) {
    selectTenant(tenants[0]);
} else {
    // Guardar tenants y dejar que el router muestre TenantSelector
    setTenants(tenants);
    setActiveTenant(null);
    localStorage.removeItem('ACTIVE_TENANT');
}

// Función para elegir tenant
const selectTenant = (tenant) => {
    setActiveTenant(tenant);
    localStorage.setItem('ACTIVE_TENANT', JSON.stringify(tenant));
};

// En logout():
localStorage.removeItem('TENANTS');
localStorage.removeItem('ACTIVE_TENANT');
setTenants([]);
setActiveTenant(null);
```

### 5.2 `axios.js` — enviar `X-Tenant-ID` automáticamente

**Archivo:** `src/config/axios.js`

```js
clienteAxios.interceptors.request.use((config) => {
    const token       = localStorage.getItem('AUTH_TOKEN');
    const activeTenant = JSON.parse(localStorage.getItem('ACTIVE_TENANT') || 'null');

    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    if (activeTenant?.id) config.headers['X-Tenant-ID'] = activeTenant.id;

    return config;
});
```

### 5.3 `Router.jsx` — ruta para `TenantSelector`

**Archivo:** `src/Router.jsx`

```jsx
// Después del login exitoso con múltiples tenants, redirigir a:
<Route path="/select-tenant" element={<TenantSelector />} />

// Guard: si no hay activeTenant y hay tenants → redirigir a /select-tenant
// Si no hay token → redirigir a /login
```

### 5.4 Pantalla `TenantSelector.jsx` (NUEVA)

**Archivo:** `src/views/TenantSelector.jsx`

- Lista de tarjetas, una por tenant
- Cada tarjeta muestra: nombre de la clínica, rol del usuario en ese tenant (badge)
- Al hacer click → `selectTenant(tenant)` → `navigate('/admin')`
- Si solo hay uno → se salta automáticamente (no se muestra esta pantalla)

```jsx
const TenantSelector = () => {
    const { tenants, selectTenant } = useAuth();
    const navigate = useNavigate();

    const handleSelect = (tenant) => {
        selectTenant(tenant);
        navigate('/admin');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fefbf5]">
            <div className="w-full max-w-lg">
                <h2>¿En qué clínica vas a trabajar hoy?</h2>
                <div className="grid gap-3 mt-6">
                    {tenants.map(t => (
                        <button key={t.id} onClick={() => handleSelect(t)}>
                            <span>{t.name}</span>
                            <span>{t.role === 'admin' ? 'Administrador' : 'Doctor'}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
```

### 5.5 `AdminSidebar.jsx` / `AdminLayout.jsx` — mostrar tenant activo + switcher

**Archivo:** `src/components/AdminSidebar.jsx`

Donde dice "Bienvenido, [nombre]", agregar:

```jsx
const { activeTenant, tenants, selectTenant } = useAuth();

// Mostrar nombre del tenant
<p className="text-xs text-slate-400">{activeTenant?.name}</p>

// Selector de tenant (solo si tiene más de uno)
{tenants.length > 1 && (
    <TenantSwitcher tenants={tenants} active={activeTenant} onSelect={selectTenant} />
)}
```

### 5.6 `TenantSwitcher.jsx` (NUEVO componente)

**Archivo:** `src/components/TenantSwitcher.jsx`

- Dropdown compacto debajo del nombre del usuario en el sidebar
- Muestra el tenant activo con un indicador verde
- Al cambiar: `selectTenant(t)` + `window.location.reload()` (o navegar a `/admin`)
- El reload es necesario para que React limpie el estado en memoria que puede tener datos del tenant anterior

```jsx
const TenantSwitcher = ({ tenants, active, onSelect }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)}>
                <span>{active?.name}</span>
                <ChevronIcon />
            </button>
            {open && (
                <div className="absolute dropdown-panel">
                    {tenants.map(t => (
                        <button
                            key={t.id}
                            onClick={() => { onSelect(t); setOpen(false); window.location.reload(); }}
                            className={t.id === active?.id ? 'active' : ''}
                        >
                            {t.name}
                            <span>{t.role === 'admin' ? 'Admin' : 'Doctor'}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
```

### 5.7 Formulario de creación de Doctor — checkbox `is_admin`

**Archivo donde se crea el doctor** (buscar en `src/views/` el form de doctores)

Agregar:

```jsx
<div className="flex items-center gap-2">
    <input
        type="checkbox"
        id="is_admin"
        checked={form.is_admin}
        onChange={(e) => setForm(f => ({ ...f, is_admin: e.target.checked }))}
    />
    <label htmlFor="is_admin" className="text-sm">
        También administrador de esta clínica
    </label>
</div>
```

Y en el payload del POST:
```js
const payload = { ...form, is_admin: form.is_admin ? 1 : 0 };
```

---

---

## 6. Extensión para Pacientes (misma lógica, distinto rol)

Los pacientes siguen exactamente la misma arquitectura que los doctores.
El mismo `users` record = misma contraseña = misma cuenta en todas las clínicas.

### 6.1 Ajuste al enum de `user_tenant`

La migración de creación del pivot debe incluir `'patient'`:

```php
$table->enum('role', ['admin', 'doctor', 'secretary', 'patient'])->default('doctor');
```

### 6.2 Los tres estados al crear un paciente (y qué hace cada uno)

| Estado del lookup | Significado | Acción |
|---|---|---|
| `not_found` | No existe en ningún tenant | Crear user nuevo + patients record + insertar en user_tenant |
| `found` | Existe en OTRO tenant | **Reutilizar user** + crear patients record aquí + insertar en user_tenant. Sin password. |
| `already_exists` | Ya es paciente en ESTE tenant | Bloquear — no tiene sentido agregarlo dos veces |

El estado `found` ya no necesita mostrar el formulario completo con campos editables.
Solo necesita una confirmación simple: "¿Agregar a esta clínica?".

### 6.3 `PatientController::store` — nueva lógica unificada

Reemplaza los dos caminos actuales (`$isImport` / normal) por un único flujo:

```php
public function store(Request $request)
{
    $tenantId = app('tenant_id');

    $data = $request->validate([
        'email'    => ['required', 'email', 'max:255'],
        'password' => ['nullable', 'string', 'min:6'],   // solo si es usuario nuevo
        'nompa'    => ['required', 'string', 'max:255'],
        'apepa'    => ['nullable', 'string', 'max:255'],
        'direc'    => ['nullable', 'string', 'max:255'],
        'sex'      => ['nullable', Rule::in(['Masculino', 'Femenino', 'Otro'])],
        'grup'     => ['nullable', 'string', 'max:50'],
        'phon'     => ['nullable', 'string', 'max:255'],
        'cump'     => ['nullable', 'date'],
        'state'    => ['nullable', Rule::in([0, 1])],
        'dni'      => ['nullable', 'string', 'max:255'],
    ]);

    return DB::transaction(function () use ($data, $tenantId) {

        // ── 1. Buscar o crear el User ──────────────────────────────────────
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            if (empty($data['password'])) {
                throw ValidationException::withMessages([
                    'password' => 'La contraseña es obligatoria para un paciente nuevo.',
                ]);
            }
            $user = User::create([
                'name'     => trim(($data['nompa'] ?? '') . ' ' . ($data['apepa'] ?? '')),
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'dni'      => $data['dni'] ?? null,
                'role'     => 'user',
            ]);
        }
        // Si el user ya existe → no tocamos su password ni ningún dato sensible

        // ── 2. Verificar que no sea ya paciente en este tenant ─────────────
        $yaExiste = Patient::where('user_id', $user->id)->exists(); // TenantScope aplica
        if ($yaExiste) {
            throw ValidationException::withMessages([
                'email' => 'Este paciente ya está registrado en esta clínica.',
            ]);
        }

        // ── 3. Insertar en pivot user_tenant ──────────────────────────────
        DB::table('user_tenant')->upsert(
            [
                'user_id'    => $user->id,
                'tenant_id'  => $tenantId,
                'role'       => 'patient',
                'active'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            ['user_id', 'tenant_id'],
            ['role', 'active', 'updated_at']
        );

        // ── 4. Crear registro patients ─────────────────────────────────────
        $patient = Patient::create([
            'user_id' => $user->id,
            'nompa'   => $data['nompa'],
            'apepa'   => $data['apepa'] ?? null,
            'direc'   => $data['direc'] ?? null,
            'sex'     => $data['sex'] ?? null,
            'grup'    => $data['grup'] ?? null,
            'phon'    => $data['phon'] ?? null,
            'cump'    => $data['cump'] ?? null,
            'state'   => $data['state'] ?? 1,
        ]);

        return response()->json([
            'message' => 'Paciente agregado correctamente.',
            'patient' => $patient,
        ], 201);
    });
}
```

> **Nota:** `global_patient_id` ya no es necesario. El vínculo entre tenants
> es el `user_id` directamente.

### 6.4 `PatientController::destroy` — no borrar el user si tiene otros tenants

```php
public function destroy($id)
{
    return DB::transaction(function () use ($id) {
        $patient = Patient::with('user')->findOrFail($id);
        $user = $patient->user;
        $tenantId = app('tenant_id');

        // Borrar solo el registro de patients (pertenece a este tenant)
        $patient->delete();

        // Borrar entrada del pivot para este tenant
        DB::table('user_tenant')
            ->where('user_id', $user->id)
            ->where('tenant_id', $tenantId)
            ->delete();

        // Borrar el user SOLO si ya no pertenece a ningún otro tenant
        $otrosTenants = DB::table('user_tenant')->where('user_id', $user->id)->count();
        if ($otrosTenants === 0) {
            $user->delete();
        }

        return response()->json(['message' => 'Paciente eliminado de esta clínica.'], 200);
    });
}
```

### 6.5 Portal del paciente — ver historial de todos sus tenants

Cuando un usuario con `role = 'patient'` se loguea, ve sus datos de TODOS los tenants
a los que pertenece.

#### Rutas nuevas (sin middleware `resolve.tenant`)

```php
// En routes/api.php — grupo auth:sanctum (sin resolve.tenant)
Route::middleware('auth:sanctum')->group(function () {

    // Todos los eventos del paciente, sin importar el tenant
    Route::get('/user/events/all', [EventController::class, 'myEventsAllTenants']);

    // Todos los documentos del paciente
    Route::get('/user/documents/all', [DocumentController::class, 'myDocumentsAllTenants']);

    // Todos los registros patients del usuario (uno por tenant)
    Route::get('/user/patients', [PatientController::class, 'myPatientRecords']);
});
```

#### `PatientController::myPatientRecords`

```php
public function myPatientRecords(Request $request)
{
    $user = $request->user();

    // Obtener todos los patients records del usuario, con el nombre del tenant
    $records = Patient::withoutGlobalScope(TenantScope::class)
        ->where('user_id', $user->id)
        ->with(['tenant:id,name,slug'])  // necesita relación en Patient model
        ->get();

    return response()->json(['data' => $records]);
}
```

#### Agregar relación `tenant` al modelo `Patient`

```php
// app/Models/Patient.php
public function tenant()
{
    return $this->belongsTo(Tenant::class);
}
```

### 6.6 Frontend — simplificar `PatientImportModal`

**Archivo:** `src/views/Usuarios/Pacientes/componentes/PatientImportModal.jsx`

Cuando el lookup devuelve `status === 'found'`, en lugar del formulario completo editable,
mostrar una tarjeta de confirmación simple:

```jsx
// PatientImportModal simplificado
const PatientImportModal = ({ foundData, onConfirm, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #008DD2, #8cb9ce)' }}>
                    <h3>Paciente encontrado</h3>
                    <p>Proveniente de: <strong>{foundData.source_tenant_name}</strong></p>
                </div>

                {/* Info del paciente — solo lectura */}
                <div className="info-grid">
                    <p><strong>Nombre:</strong> {foundData.nompa} {foundData.apepa}</p>
                    <p><strong>Email:</strong> {foundData.email}</p>
                    {foundData.dni && <p><strong>DNI:</strong> {foundData.dni}</p>}
                    {foundData.phon && <p><strong>Teléfono:</strong> {foundData.phon}</p>}
                </div>

                {/* Aviso de contraseña */}
                <div className="info-banner">
                    El paciente ya tiene cuenta. Se va a agregar a esta clínica con su
                    contraseña existente — no necesitás crear una nueva.
                </div>

                {/* Footer */}
                <div className="footer">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={() => onConfirm({ import_user_id: foundData.user_id, email: foundData.email, nompa: foundData.nompa, apepa: foundData.apepa })}>
                        Agregar a esta clínica
                    </button>
                </div>
            </div>
        </div>
    );
};
```

> **Clave:** `onConfirm` envía `{ import_user_id, email, nompa, apepa }`.
> El backend solo necesita el `email` para encontrar el user — el password no se toca.

### 6.7 Frontend — `LookupStatusBadge` cuando status es `found`

**Archivo:** `src/views/Usuarios/Pacientes/componentes/LookupStatusBadge.jsx`

Cambiar el mensaje del estado `found` de ser un badge pasivo a un CTA activo:

```jsx
// Estado 'found' — en lugar de solo mostrar info, mostrar que puede agregarlo
case 'found':
    return (
        <span className="badge badge-blue">
            ✓ Paciente encontrado en otra clínica — podés agregarlo directamente
        </span>
    );
```

El modal se abre automáticamente al detectar `status === 'found'` (ya funciona así en `Paciente.jsx`).

### 6.8 Portal paciente — vista unificada cross-tenant

**Archivo nuevo:** `src/views/Paciente/MiHistorial.jsx`

Cuando el paciente se loguea en el portal (no el admin), ve:

```jsx
// Pestañas por clínica
const MiHistorial = () => {
    const [records, setRecords] = useState([]); // un record por tenant

    useEffect(() => {
        // GET /api/user/patients — no necesita X-Tenant-ID
        clienteAxios.get('/api/user/patients').then(({ data }) => {
            setRecords(data.data);
        });
    }, []);

    return (
        <div>
            <h2>Mi historial médico</h2>
            {records.map(record => (
                <section key={record.idpa}>
                    <h3>{record.tenant?.name ?? 'Clínica'}</h3>
                    {/* Odontograma, consultas, archivos de ese tenant */}
                </section>
            ))}
        </div>
    );
};
```

---

## 7. Archivos a modificar / crear

### Backend (`c:/laragon/www/back-dentalcorsoftware`)

| Acción | Archivo |
|---|---|
| CREAR | `database/migrations/XXXX_create_user_tenant_table.php` |
| CREAR | `database/migrations/XXXX_migrate_users_tenant_to_pivot.php` |
| MODIFICAR | `app/Models/User.php` — agregar relación `tenants()`, quitar `tenant_id` |
| MODIFICAR | `app/Models/Patient.php` — agregar relación `tenant()` |
| MODIFICAR | `app/Http/Middleware/ResolveTenant.php` — leer `X-Tenant-ID` + verificar pivot |
| MODIFICAR | `app/Http/Middleware/IsAdmin.php` — leer `tenant_role` del container |
| MODIFICAR | `app/Http/Controllers/AuthController.php` — devolver `tenants` en login |
| MODIFICAR | `app/Http/Controllers/DoctorController.php` — reutilizar user existente + `is_admin` |
| MODIFICAR | `app/Http/Controllers/PatientController.php` — flujo unificado + `destroy` seguro + `myPatientRecords` |
| MODIFICAR | `app/Http/Controllers/EventController.php` — agregar `myEventsAllTenants` |
| MODIFICAR | `app/Http/Controllers/DocumentController.php` — agregar `myDocumentsAllTenants` |
| ELIMINAR | `app/Http/Controllers/PatientLookupController.php` — lógica absorbida por `store` |
| MODIFICAR | `routes/api.php` — agregar `GET /user/tenants`, `GET /user/patients`, `GET /user/events/all`, `GET /user/documents/all` |

### Frontend (`src/`)

| Acción | Archivo |
|---|---|
| MODIFICAR | `src/hooks/useAuth.js` — estado `tenants`, `activeTenant`, `selectTenant()` |
| MODIFICAR | `src/config/axios.js` — interceptor `X-Tenant-ID` |
| MODIFICAR | `src/Router.jsx` — ruta `/select-tenant` + guards |
| CREAR | `src/views/TenantSelector.jsx` |
| CREAR | `src/components/TenantSwitcher.jsx` |
| MODIFICAR | `src/components/AdminSidebar.jsx` — mostrar tenant activo + `TenantSwitcher` |
| MODIFICAR | `src/layout/AdminLayout.jsx` — si no hay `activeTenant`, redirigir a `/select-tenant` |
| MODIFICAR | Form de creación de Doctor — agregar checkbox `is_admin` |
| MODIFICAR | `src/views/Usuarios/Pacientes/componentes/PatientImportModal.jsx` — simplificar a confirmación sin form |
| MODIFICAR | `src/views/Usuarios/Pacientes/componentes/LookupStatusBadge.jsx` — texto del estado `found` |
| MODIFICAR | `src/views/Usuarios/Pacientes/Paciente.jsx` — quitar campos de password en flujo import |
| CREAR | `src/views/Paciente/MiHistorial.jsx` — portal cross-tenant para pacientes |

---

## 8. Fases de implementación (de menor a mayor riesgo)

### Fase 1 — Base de datos (sin romper nada aún)
1. Crear migración `user_tenant` con enum `['admin','doctor','secretary','patient']`
2. Crear migración que **copia** los datos de `users.tenant_id` al pivot (rol derivado de `users.role`)
3. Verificar que los datos migraron bien
4. **NO eliminar** `users.tenant_id` todavía

### Fase 2 — Backend con soporte dual (compatibilidad hacia atrás)
1. Agregar relación `tenants()` al modelo `User` y `tenant()` al modelo `Patient`
2. Modificar `AuthController::login` para devolver `tenants`
3. Modificar `ResolveTenant`: leer `X-Tenant-ID` **pero con fallback a `users.tenant_id`** si el header no viene
4. Agregar rutas `GET /user/tenants`, `GET /user/patients`, `GET /user/events/all`, `GET /user/documents/all`
5. Modificar `DoctorController::store` (reutilizar user + `is_admin`)
6. Modificar `PatientController::store` (flujo unificado sin `$isImport`)
7. Modificar `PatientController::destroy` (no borrar user si tiene otros tenants)
8. Probar con Postman/Insomnia

### Fase 3 — Frontend (admin panel)
1. Actualizar `useAuth.js` y `axios.js` (interceptor `X-Tenant-ID`)
2. Crear `TenantSelector.jsx`
3. Actualizar `Router.jsx` con guard de tenant
4. Crear `TenantSwitcher.jsx`
5. Actualizar `AdminSidebar.jsx` (nombre del tenant + switcher)
6. Agregar checkbox `is_admin` en form de doctor
7. Simplificar `PatientImportModal` (confirmación simple, sin form)
8. Probar flujo completo: login → selector → panel → cambio de tenant

### Fase 4 — Frontend (portal paciente)
1. Crear `MiHistorial.jsx` con pestañas por clínica
2. Conectar `GET /user/events/all` y `GET /user/documents/all`
3. Probar que el paciente ve datos de todas sus clínicas

### Fase 5 — Limpieza (solo cuando todo funcione)
1. Eliminar fallback de `users.tenant_id` en `ResolveTenant`
2. Crear migración que elimina `users.tenant_id`
3. Eliminar `PatientLookupController` y su ruta
4. Eliminar campo `global_patient_id` de `patients` (reemplazado por `user_id`)
5. Eliminar `tenant_id` de `$fillable` en `User`

---

## 9. Consideraciones importantes

### Contraseña única — comunicar al usuario
El mismo `users` record se reutiliza entre tenants. Cambiar la contraseña en un tenant la cambia en todos.
Mostrar en la UI: *"Tu contraseña es la misma para todas las clínicas en las que estás registrado."*

### Al agregar un paciente/doctor ya existente — nunca pedir contraseña
Si el email ya existe en `users`, el backend reutiliza ese registro silenciosamente.
El frontend **no debe mostrar campo de contraseña** cuando `lookupStatus === 'found'`.

### `PatientLookupController` queda obsoleto
La nueva lógica de `PatientController::store` absorbe toda la detección.
El hook `usePatientLookup` sigue siendo útil para dar feedback **antes** de submitear.

### Estado en memoria al cambiar de tenant
Al cambiar de tenant en el `TenantSwitcher`, hacer `window.location.reload()` para limpiar
todo el estado de React. Es la opción más simple y segura.

### Tokens de Sanctum
Un solo token sirve para todos los tenants del usuario. El tenant activo viaja en `X-Tenant-ID`.

### Seguridad del `X-Tenant-ID`
`ResolveTenant` verifica en `user_tenant` que el usuario pertenece al tenant que pide.
No se puede falsificar el header para acceder a un tenant ajeno.

### Borrado de pacientes
`destroy` solo elimina el registro `patients` de ese tenant y la entrada del pivot.
Si el paciente pertenece a otros tenants, su cuenta (`users`) se preserva.
El admin de una clínica no puede borrar la cuenta global del paciente.

### Doctor/Admin que también es Admin en otro tenant
`role` en `user_tenant` es **por fila** (por tenant). El mismo user puede ser:
- `role = 'admin'` en Clínica A
- `role = 'doctor'` en Clínica B
- `role = 'patient'` en Clínica C (si también va como paciente)
