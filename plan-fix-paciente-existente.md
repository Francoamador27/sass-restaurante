# Fix: Asignación de paciente existente a clínica sin requerir contraseña

## Problema

Cuando el usuario ingresa un DNI y el sistema detecta que ese paciente ya existe
(en otra clínica o tenant), aparece el modal "Paciente encontrado". Al confirmar
"Agregar a esta clínica", el formulario sigue exigiendo contraseña y el usuario
tiene que rellenarlo manualmente antes de poder guardar.

## Causa raíz (dos bugs + un problema de UX)

### Bug 1 — Modal no pasa los IDs de importación
`PatientImportModal.jsx` → función `handleConfirm` (línea 11-23):
el objeto que se pasa a `onConfirm` no incluye `import_user_id` ni
`source_patient_id`. En consecuencia, `importMeta` en `Paciente.jsx` queda
`{ import_user_id: undefined, source_patient_id: undefined }`.

### Bug 2 — Atributo HTML `required` ignora `importMeta`
`Paciente.jsx` → campo contraseña (línea 456):
```jsx
required={isCreating}          // ← siempre true al crear, sin importar importMeta
minLength={isCreating ? 6 : undefined}
```
El navegador aplica la validación HTML5 *antes* de ejecutar `handleSubmit`,
por lo que bloquea el envío aunque el JS ya tenga la lógica correcta
(`if (isCreating && !importMeta && ...)`).

### Problema UX — El usuario debe hacer submit manualmente
Después de confirmar el modal, el formulario se pre-llena pero el usuario
igual tiene que hacer clic en "Crear paciente". El flujo correcto es:
confirmar el modal → el sistema asigna automáticamente → redirige a la lista.

---

## Solución

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/views/Usuarios/Pacientes/componentes/PatientImportModal.jsx` | Pasar `import_user_id` y `source_patient_id` en `handleConfirm` |
| `src/views/Usuarios/Pacientes/Paciente.jsx` | Auto-submit al confirmar modal; arreglar `required`/`minLength` del campo password |

### Backend (`PatientController.php`)
Sin cambios necesarios. El backend ya maneja correctamente:
- Si el `User` existe por email → lo reutiliza, no exige contraseña.
- Si no existe → exige contraseña (ruta normal).
- `Patient::where('user_id')->exists()` usa `TenantScope`, por lo que
  solo verifica si ya es paciente *en este tenant*.

---

## Detalle de cambios

### PatientImportModal.jsx — agregar IDs al callback

```js
// ANTES
const handleConfirm = () => {
    onConfirm({
        email: foundData.email,
        nompa: foundData.nompa,
        // ...sin import_user_id ni source_patient_id
    });
};

// DESPUÉS
const handleConfirm = () => {
    onConfirm({
        email:             foundData.email,
        nompa:             foundData.nompa,
        apepa:             foundData.apepa  ?? '',
        phon:              foundData.phon   ?? '',
        direc:             foundData.direc  ?? '',
        sex:               foundData.sex    ?? '',
        cump:              foundData.cump   ?? '',
        grup:              foundData.grup   ?? '',
        dni:               foundData.dni    ?? '',
        import_user_id:    foundData.user_id,            // ← nuevo
        source_patient_id: foundData.source_patient_id,  // ← nuevo
    });
};
```

### Paciente.jsx — tres cambios

**1. Auto-submit al confirmar modal**

Extraer la lógica de llamada a la API en `doCreate(payload)` y llamarla
directamente desde `onConfirm`, en lugar de solo pre-llenar el formulario.

**2. Atributo `required` del campo password**

```jsx
// ANTES
required={isCreating}
minLength={isCreating ? 6 : undefined}

// DESPUÉS
required={isCreating && !importMeta}
minLength={isCreating && !importMeta ? 6 : undefined}
```

**3. Asterisco del label de contraseña**

```jsx
// ANTES
{isCreating && <span className="text-red-500">*</span>}

// DESPUÉS
{isCreating && !importMeta && <span className="text-red-500">*</span>}
```

---

## Flujo corregido

```
Usuario ingresa DNI
  ↓
usePatientLookup detecta paciente en otra clínica (found: true)
  ↓
PatientImportModal aparece con datos del paciente
  ↓
Usuario hace clic en "Agregar a esta clínica"
  ↓
handleConfirm pasa TODOS los datos (incluye import_user_id)
  ↓
onConfirm en Paciente.jsx llama directamente a POST /api/pacientes
  ↓
Backend encuentra User por email → lo reutiliza (sin crear contraseña)
Backend hace upsert en user_tenant para vincular al nuevo tenant
Backend crea registro en patients
  ↓
mostrarExito → navigate('/admin-dash/pacientes')
```

---

## Flujo SIN cambios (paciente nuevo)

El flujo normal de creación (paciente nuevo, no encontrado en el sistema)
no se ve afectado: el campo contraseña sigue siendo `required` cuando
`importMeta` es `null`.
