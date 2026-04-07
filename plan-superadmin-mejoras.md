# Plan de mejoras — SuperAdmin + Admin-Dash (arquitectura multitenancy completa)

**Fecha:** 2026-04-01  
**Alcance:** Separación definitiva de responsabilidades entre SuperAdmin y Admin (tenant). Arquitectura de settings por tenant.

---

## Arquitectura decidida

| Funcionalidad | SuperAdmin `/superadmin-dash` | Admin tenant `/admin-dash` |
|---|---|---|
| Testimonios | ✅ Gestiona (landing global) | ❌ Quitar |
| Galería (Ejemplos) | ✅ Gestiona (landing global) | ❌ Quitar |
| Servicios | ✅ Gestiona (landing global) | ❌ No aplica |
| Chatbot | ✅ Gestiona (landing global) | ❌ Quitar |
| Configuraciones empresa global | ✅ (landing page) | ❌ No aplica |
| SMTP global | ✅ (formulario contacto, etc.) | ❌ No aplica |
| Notificaciones | ✅ Solo superadmin | ❌ Quitar |
| **Datos de la clínica** | ❌ No aplica | ✅ Por tenant (tabla nueva) |
| **SMTP de la clínica** | ❌ No aplica | ✅ Por tenant (tabla nueva) |
| Pacientes, Doctores, Citas, Finanzas | ❌ No aplica | ✅ Con TenantScope |
| Usuarios del tenant | ❌ No aplica | ✅ Con TenantScope |
| Tenants CRUD | ✅ Solo superadmin | ❌ No aplica |

---

## PARTE 1 — Cambios en Admin-Dash (tenant)

### 1.1 Quitar del sidebar y Router

Eliminar de `AdminSidebar.jsx` y de `Router.jsx` (rutas `/admin-dash/*`):

| Item | Ruta actual | Acción |
|---|---|---|
| Testimonios | `/admin-dash/testimonios` | Eliminar de sidebar + Router |
| Galería | `/admin-dash/ejemplos` | Eliminar de sidebar + Router |
| Chatbot | `/admin-dash/chatbot` | Eliminar de sidebar + Router |

**Archivos a modificar:**
- `src/components/AdminSidebar.jsx` — quitar 3 items del array `menuItems`
- `src/Router.jsx` — quitar 3 rutas + sus imports

---

### 1.2 Reemplazar "Configuraciones" por "Mi Clínica"

La pestaña actual de Configuraciones en admin-dash abre datos globales (empresa, SMTP global). Debe reemplazarse por una versión que solo muestre y guarde datos **del tenant**.

**Nueva vista:** `src/views/AdminDash/MiClinica/MiClinica.jsx`  
**Ruta:** `/admin-dash/configuraciones` (mismo path, diferente componente)

**Tabs nuevos:**

#### Tab 1 — Datos de la clínica
- Campos: nombre clínica, logo, teléfono, email, dirección, horarios de atención, WhatsApp
- Lee/escribe: `GET /api/tenant-settings` / `POST /api/tenant-settings`
- **NO toca** la tabla `settings` global

#### Tab 2 — SMTP de la clínica
- Campos: host, port, username, password, encryption, from_email, from_name
- Sirve para que los emails automáticos del tenant (recordatorios de citas, etc.) salgan con su cuenta
- Lee/escribe: `GET /api/tenant-smtp` / `PUT /api/tenant-smtp`
- **NO toca** la tabla `mail_settings` global

**Archivos a crear:**
```
src/views/AdminDash/MiClinica/
  MiClinica.jsx                ← contenedor con tabs
  DatosClinica.jsx             ← tab 1 (datos de la clínica)
  SmtpClinica.jsx              ← tab 2 (SMTP del tenant)
```

**Archivos a modificar:**
- `src/components/AdminSidebar.jsx` — renombrar ítem "Configuraciones" → "Mi Clínica"
- `src/Router.jsx` — reemplazar import de `Configuraciones` por `MiClinica`

---

## PARTE 2 — Cambios en backend para settings por tenant

### 2.1 Nueva tabla: `tenant_settings`

```sql
id, tenant_id (FK), clinic_name, logo, phone, email,
address, business_hours, whatsapp, created_at, updated_at
```

**Migration:** `create_tenant_settings_table`  
**Model:** `App\Models\TenantSetting` con TenantScope  
**Controller:** `App\Http\Controllers\TenantSettingController`  
**Rutas:** dentro del grupo `auth:sanctum + resolve.tenant`

```
GET  /api/tenant-settings     → show()   (devuelve el registro del tenant)
POST /api/tenant-settings     → update() (upsert — crea si no existe)
```

### 2.2 Nueva tabla: `tenant_mail_settings`

```sql
id, tenant_id (FK, unique), host, port, username, password,
encryption, from_email, from_name, created_at, updated_at
```

**Migration:** `create_tenant_mail_settings_table`  
**Model:** `App\Models\TenantMailSetting` con TenantScope  
**Controller:** `App\Http\Controllers\TenantMailSettingController`  
**Rutas:** dentro del grupo `auth:sanctum + resolve.tenant + IsAdmin`

```
GET /api/tenant-smtp     → show()
PUT /api/tenant-smtp     → update()
```

### 2.3 Sin cambios en tablas existentes

- `settings` → sigue siendo global (superadmin)
- `mail_settings` → sigue siendo global (superadmin, para contacto/forgot-password del front)

---

## PARTE 3 — Completar panel SuperAdmin (9 rutas faltantes)

### 3.1 `/superadmin-dash/tenants/:id/admin` — Crear admin para un tenant

**Componente nuevo:** `src/views/SuperAdmin/Tenants/CreateAdminForTenant.jsx`

- Recibe `tenantId` de los URL params
- Muestra nombre del tenant (carga de `/api/superadmin/tenants/:id`)
- Formulario: nombre, email, contraseña
- Llama: `POST /api/superadmin/tenants/:id/admin`

**Backend:** ya existe. Sin cambios.

---

### 3.2 `/superadmin-dash/testimonios` — Gestión de testimonios

**Componente nuevo:** `src/views/SuperAdmin/Testimonios/SuperAdminTestimonios.jsx`

- Lista: `GET /api/testimonios` (público)
- Crear: `POST /api/superadmin/testimonios`
- Eliminar: `DELETE /api/superadmin/testimonios/:id`

Adaptar lógica de `PanelTestimonios.jsx` + `TestimoniosForm.jsx` con endpoints corregidos.

**Backend:** ya existe. Sin cambios.

---

### 3.3 `/superadmin-dash/ejemplos` — Gestión de galería

**Componente nuevo:** `src/views/SuperAdmin/Ejemplos/SuperAdminEjemplos.jsx`

- Lista: `GET /api/ejemplos` (público)
- Subir: `POST /api/superadmin/ejemplos`
- Eliminar: `DELETE /api/superadmin/ejemplos/:id`

Adaptar lógica de `EjemplosPanel.jsx` con endpoints corregidos.

**Backend:** ya existe. Sin cambios.

---

### 3.4 `/superadmin-dash/servicios` — Gestión de servicios

**Componentes nuevos:**
```
src/views/SuperAdmin/Servicios/
  SuperAdminServicios.jsx         ← contenedor (tabs)
  SuperAdminServiciosForm.jsx     ← basado en TratamientosForm
  SuperAdminServiciosList.jsx     ← basado en ServiciosList
```

Todos usan `/api/superadmin/servicios` en lugar de `/api/servicios`.

**Backend:** ya existe. Sin cambios.

---

### 3.5 `/superadmin-dash/chatbot` — Chatbot flow builder

**Componente nuevo:** `src/views/SuperAdmin/Chatbot/SuperAdminChatbot.jsx`

Copiar `AdminChatbot.jsx` cambiando los 3 endpoints:
- `GET /api/chatbot-flow` → sin cambio (lectura pública)
- `PUT /api/chatbot-flow/flow` → `/api/superadmin/chatbot-flow/flow`
- `PUT /api/chatbot-flow/builder-state` → `/api/superadmin/chatbot-flow/builder-state`

**Backend:** ya existe. Sin cambios.

---

### 3.6 `/superadmin-dash/mail-config` — SMTP global

**Componente nuevo:** `src/views/SuperAdmin/MailConfig/SuperAdminMailConfig.jsx`

- Lee: `GET /api/superadmin/mail-config`
- Guarda: `PUT /api/superadmin/mail-config`

Adaptar lógica de `Smtp.jsx` con endpoints `/api/superadmin/mail-config`.

**Backend:** ya existe. Sin cambios.

---

### 3.7 `/superadmin-dash/configuraciones` — Configuración global de la plataforma

**Componente nuevo:** `src/views/SuperAdmin/Configuraciones/SuperAdminConfiguraciones.jsx`

Tabs:
- **Empresa** → datos del landing page (company_name, logo, address, etc.) via `POST /api/superadmin/settings`
- **SMTP global** → mismo que mail-config (reutilizar `SuperAdminMailConfig`)

Adaptar lógica de `Company.jsx` con endpoint `/api/superadmin/settings`.

**Backend:** ya existe. Sin cambios.

---

## PARTE 4 — Resumen de archivos

### Backend — nuevos archivos

```
database/migrations/
  xxxx_create_tenant_settings_table.php
  xxxx_create_tenant_mail_settings_table.php

app/Models/
  TenantSetting.php
  TenantMailSetting.php

app/Http/Controllers/
  TenantSettingController.php
  TenantMailSettingController.php

routes/api.php  ← 2 rutas nuevas en grupo tenant
```

### Frontend — archivos a crear (12 nuevos)

```
src/views/
  AdminDash/MiClinica/
    MiClinica.jsx
    DatosClinica.jsx
    SmtpClinica.jsx
  SuperAdmin/
    Tenants/
      CreateAdminForTenant.jsx
    Testimonios/
      SuperAdminTestimonios.jsx
    Ejemplos/
      SuperAdminEjemplos.jsx
    Servicios/
      SuperAdminServicios.jsx
      SuperAdminServiciosForm.jsx
      SuperAdminServiciosList.jsx
    Chatbot/
      SuperAdminChatbot.jsx
    MailConfig/
      SuperAdminMailConfig.jsx
    Configuraciones/
      SuperAdminConfiguraciones.jsx
```

### Frontend — archivos a modificar (2)

| Archivo | Cambio |
|---|---|
| `src/components/AdminSidebar.jsx` | Quitar Testimonios, Galería, Chatbot. Renombrar Configuraciones → Mi Clínica |
| `src/Router.jsx` | Quitar 3 rutas admin. Reemplazar Configuraciones. Agregar 9 rutas superadmin |

---

## Orden de implementación (Partes 1–3, ya completadas)

| # | Tarea | Estado |
|---|---|---|
| 1 | Backend: migrations + models + controllers tenant settings/smtp | ✅ Hecho |
| 2 | Backend: rutas `/api/tenant-settings` y `/api/tenant-smtp` | ✅ Hecho |
| 3 | Admin-Dash sidebar: quitar Testimonios, Galería, Chatbot | ✅ Hecho |
| 4 | Admin-Dash: `MiClinica.jsx` (datos clínica + smtp tenant) | ✅ Hecho |
| 5 | Router.jsx: cleanup admin + nueva ruta Mi Clínica | ✅ Hecho |
| 6–13 | Todas las vistas SuperAdmin + Router | ✅ Hecho |

---

## PARTE 5 — Cross-tenant patient lookup (búsqueda global de pacientes)

**Fecha agregada:** 2026-04-01  
**Estado:** Pendiente

### Descripción del feature

Cuando un admin de cualquier clínica intenta registrar un paciente nuevo, el sistema chequea **en tiempo real** (al salir del campo email o DNI) si ese paciente ya existe en la base de datos global (en otro tenant). Si existe, muestra un popup con los datos conocidos, permite editar campos, y permite importarlo a la clínica actual con un click.

---

### Decisión arquitectónica

| Opción | Descripción | Decisión |
|---|---|---|
| A — Usuario global | Un registro `users` por persona (compartido entre tenants), muchos registros `patients` (uno por tenant) | **✅ Elegida** |
| B — Usuario por tenant | Duplicar el registro `users` por cada tenant | ❌ Datos duplicados, peor UX |
| C — UUID global | Columna `global_patient_uuid` de enlace sin cambiar users | ❌ Más complejo, similar resultado |

**Justificación de Opción A:**  
Un paciente es una persona real → un solo cuenta (`users`). La información clínica y de admisión varía por clínica → un `patients` por tenant. El `user` puede existir en `users` sin `tenant_id` asignado (como usuario global) mientras sus `patients` están aislados por tenant.

---

### Problema actual que bloquea la feature

`PatientController::store()` valida `unique:users,email` y `unique:users,dni` de forma **global**. Esto hace que dos clínicas no puedan registrar al mismo paciente (mismo email o DNI).

**Solución:** Cambiar la validación del `store()` para aceptar emails/DNI ya existentes en `users` cuando el request lleva `import_user_id`. En ese caso se omite la creación del user y se reutiliza el existente.

---

### Flujo completo de usuario

```
Admin escribe email o DNI en el formulario de nuevo paciente
         │
         ▼ (al salir del campo — onBlur — si tiene ≥ 4 chars)
  GET /api/admin/patients/global-lookup?email=X
         │
    ┌────┴────┐
    │         │
found       not found
    │         │
    ▼         ▼
Popup modal  Badge verde "✓ Paciente nuevo" — continúa normal
"Encontramos a este
paciente en nuestra BD"
    │
    ▼
Admin revisa / edita campos
    │
    ▼
Click "Agregar a esta clínica"
    │
    ▼
POST /api/admin/patients con { import_user_id: X, ...data }
    │
    ▼
Backend: crea solo el registro patients (omite crear user)
         + si hay campos modificados → PUT /api/users/:id (actualiza user)
```

---

### PARTE 5.1 — Backend

#### 5.1.1 Nueva migración: `patients` — columna `global_patient_id`

**Archivo:** `database/migrations/xxxx_add_global_patient_id_to_patients_table.php`

```sql
ALTER TABLE patients ADD COLUMN global_patient_id BIGINT UNSIGNED NULL;
-- No FK, solo referencia "suave" para poder linkear el mismo idpa de otro tenant
```

> **Propósito:** cuando se importa un paciente, `patients.global_patient_id` apunta al `idpa` del registro original en el tenant de origen. Permite saber que dos registros `patients` son la misma persona. Es nullable — los pacientes no importados no lo tienen.

---

#### 5.1.2 Nuevo controller: `PatientLookupController`

**Archivo:** `app/Http/Controllers/PatientLookupController.php`

**Método:** `lookup(Request $request)`

```
GET /api/admin/patients/global-lookup
  ?email=juan@mail.com
  &dni=12345678        (opcional, alternativo al email)
```

Lógica:
1. Valida que venga al menos `email` o `dni`
2. Busca en `users` **sin TenantScope** (withoutGlobalScopes o query directo)  
3. Descarta si el user ya es paciente del **tenant actual** (`patients.tenant_id = current_tenant`)
4. Si encontrado en otro tenant:
   - Carga `patients` relacionado del otro tenant (también sin scope)
   - Devuelve `{ found: true, user: {...}, patient: {...} }`
5. Si no encontrado: `{ found: false }`

**Nota de seguridad:** el endpoint solo devuelve datos básicos del paciente (nombre, email, dni, teléfono). No devuelve historial clínico, odontograma ni documentos — esos son datos del tenant de origen y no se comparten.

**Datos que SÍ se devuelven:**
```json
{
  "found": true,
  "user_id": 42,
  "nompa": "Juan",
  "apepa": "Pérez",
  "email": "juan@mail.com",
  "dni": "12345678",
  "phon": "11-1234-5678",
  "direc": "Av. Siempre Viva 123",
  "sex": "Masculino",
  "cump": "1990-05-15",
  "source_tenant_name": "Clínica Norte"
}
```

---

#### 5.1.3 Modificar `PatientController::store()`

Aceptar campo opcional `import_user_id` en el request:

```php
// Si viene import_user_id → saltear creación de user
if ($request->filled('import_user_id')) {
    $user = User::findOrFail($request->import_user_id);

    // Si el admin cambió datos → actualizar el user global
    $user->update([
        'name'          => trim($data['nompa'] . ' ' . $data['apepa']),
        'dni'           => $data['dni'] ?? $user->dni,
        'codigo_postal' => $data['codigo_postal'] ?? $user->codigo_postal,
        'provincia'     => $data['provincia'] ?? $user->provincia,
    ]);

    // Validación de email debe ignorar este user_id:
    // 'email' => ['required','email','unique:users,email,' . $user->id]
} else {
    // Flujo normal: crear nuevo user
    $user = User::create([...]);
}

// Crear patients para el tenant actual (igual que ahora)
$patient = Patient::create([
    'user_id'          => $user->id,
    'global_patient_id'=> $request->source_patient_id ?? null, // idpa del origen
    ...
]);
```

**Validación ajustada cuando viene `import_user_id`:**
- Quitar `unique:users,email` y `unique:users,dni` (el user ya existe, está bien que exista)
- Agregar `unique:patients,user_id,NULL,idpa,tenant_id,{current_tenant}` para evitar que el mismo user sea importado dos veces al mismo tenant

---

#### 5.1.4 Nueva ruta en `api.php`

Dentro del grupo `auth:sanctum + resolve.tenant + IsAdmin`:

```php
Route::get('/patients/global-lookup', [PatientLookupController::class, 'lookup']);
```

> **Debe ir ANTES** de la ruta `Route::get('/pacientes/{patient}', ...)` para que Laravel no confunda "global-lookup" con un ID de paciente.

---

### PARTE 5.2 — Frontend

#### 5.2.1 Nuevo componente: `PatientImportModal.jsx`

**Archivo:** `src/views/Usuarios/Pacientes/componentes/PatientImportModal.jsx`

Props:
- `foundData` — objeto con los datos del paciente encontrado
- `onConfirm(data)` — callback con los datos (posiblemente editados) a usar en el form
- `onClose()` — cerrar sin importar

UI:
```
┌─────────────────────────────────────────────────────┐
│  🔍 Paciente encontrado en la base de datos         │
│  Proveniente de: "Clínica Norte"                    │
├─────────────────────────────────────────────────────┤
│  Nombre *   [Juan          ] Apellido * [Pérez     ]│
│  Email  *   [juan@mail.com ]  DNI       [12345678  ]│
│  Teléfono   [11-1234-5678  ]  Dirección [Av...     ]│
│  Nacimiento [1990-05-15    ]  Sexo      [Masculino ]│
│                                                     │
│  ⚠️  Podés editar los datos antes de agregar.       │
│  Los cambios también actualizarán el perfil global  │
│  del paciente.                                      │
├─────────────────────────────────────────────────────┤
│  [Cancelar]                 [Agregar a mi clínica →]│
└─────────────────────────────────────────────────────┘
```

Todos los campos son editables (inputs controlados).  
Al click "Agregar": llama `onConfirm({ ...editedFields, import_user_id, source_patient_id })`.

---

#### 5.2.2 Nuevo hook: `usePatientLookup.js`

**Archivo:** `src/views/Usuarios/Pacientes/hooks/usePatientLookup.js`

```js
// Maneja el estado y la llamada al endpoint de lookup
// Devuelve: { status, foundData, triggerLookup, reset }
// status: 'idle' | 'loading' | 'found' | 'not_found' | 'already_exists' | 'error'
```

Lógica:
- `triggerLookup(email, dni)` — llama a `GET /api/admin/patients/global-lookup`
- Devuelve el status y `foundData` si fue encontrado
- `reset()` — vuelve a `idle` (para cuando el usuario borra el campo)

---

#### 5.2.3 Nuevo componente: `LookupStatusBadge.jsx`

**Archivo:** `src/views/Usuarios/Pacientes/componentes/LookupStatusBadge.jsx`

Muestra bajo el campo email/DNI según el estado:

| Status | UI |
|---|---|
| `idle` | (nada) |
| `loading` | `⟳ Verificando en base de datos...` (spinner animado) |
| `found` | Modal se abre automáticamente |
| `not_found` | `✓ Paciente nuevo` (badge verde) |
| `already_exists` | `⚠ Este paciente ya está en tu clínica` (badge amarillo) |
| `error` | (silencioso — no interrumpir el flujo) |

---

#### 5.2.4 Modificar `Paciente.jsx` (modo creación)

**Solo en `isCreating`:**

1. Importar `usePatientLookup` y los dos nuevos componentes
2. En el campo `email`: agregar `onBlur` que dispara `triggerLookup`
3. En el campo `dni`: agregar `onBlur` que dispara `triggerLookup` (alternativo)
4. Renderizar `<LookupStatusBadge status={status} />` bajo el campo
5. Renderizar `<PatientImportModal />` cuando `status === 'found'`
6. Al `onConfirm`: pre-llenar todo el formulario con los datos y agregar `import_user_id` al payload del POST
7. El `handleSubmit` existente detecta si hay `import_user_id` en el estado y lo incluye en el body

**Cambios al payload del POST cuando es importación:**
```js
const payload = {
  ...paciente,          // datos editados
  import_user_id: importUserId,      // ← nuevo
  source_patient_id: sourcePatientId, // ← nuevo (para global_patient_id)
};
```

---

### PARTE 5.3 — Resumen de archivos

#### Backend — archivos nuevos

```
database/migrations/
  xxxx_add_global_patient_id_to_patients_table.php

app/Http/Controllers/
  PatientLookupController.php
```

#### Backend — archivos modificados

```
app/Http/Controllers/PatientController.php
  → store(): aceptar import_user_id, ajustar validaciones
  
routes/api.php
  → GET /api/admin/patients/global-lookup (antes de /{patient})
```

#### Frontend — archivos nuevos (3)

```
src/views/Usuarios/Pacientes/
  hooks/
    usePatientLookup.js
  componentes/
    PatientImportModal.jsx
    LookupStatusBadge.jsx
```

#### Frontend — archivos modificados (1)

```
src/views/Usuarios/Pacientes/Paciente.jsx
  → Integrar lookup en campos email y DNI (solo en modo creación)
  → Incluir import_user_id en el payload del POST
```

---

### PARTE 5.4 — Orden de implementación

| # | Tarea | Complejidad | Requisito |
|---|---|---|---|
| 1 | Migration: `global_patient_id` en patients | Baja | — |
| 2 | Backend: `PatientLookupController` con endpoint global-lookup | Media | #1 |
| 3 | Backend: modificar `PatientController::store()` para `import_user_id` | Media | — |
| 4 | Backend: registrar ruta en `api.php` | Baja | #2, #3 |
| 5 | Frontend: `usePatientLookup.js` (hook de estado + llamada API) | Baja | #4 |
| 6 | Frontend: `LookupStatusBadge.jsx` (indicador visual bajo el campo) | Baja | #5 |
| 7 | Frontend: `PatientImportModal.jsx` (modal editable + confirm) | Media | #5 |
| 8 | Frontend: integrar en `Paciente.jsx` | Media | #6, #7 |

---

### Notas de seguridad y edge cases

- **No exponer historial clínico**: el lookup solo devuelve datos demográficos básicos. Los registros de `consult`, `odontograma`, `document`, `patologias` son estrictamente del tenant de origen.
- **Paciente ya en la clínica actual**: si el lookup encuentra al user y ya tiene un `patients` en este tenant → devolver `already_exists`, no abrir el modal.
- **Email cambiado**: si el admin cambia el email en el modal → validar que el nuevo email no esté ya en `users` (para otro user distinto).
- **Sin contraseña nueva**: al importar, el usuario YA tiene contraseña. No generar una nueva ni pedirla.
- **Rate limiting**: el endpoint de lookup debe tener rate limiting (`throttle:30,1`) para prevenir enumeración de emails.
