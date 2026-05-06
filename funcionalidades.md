# DentalCor — Funcionalidades del Sistema

Software odontológico multi-tenant para clínicas y consultorios dentales.

---

## 1. Agenda y Calendario

- Vista mensual, semanal, diaria y de lista
- Crear, editar y cancelar citas con un clic
- Código de color por doctor para identificar citas rápidamente
- Selección de fecha directa desde el calendario
- Exportar cita a ICS (Google Calendar, Outlook, Apple Calendar)
- Notificación automática al paciente por email al crear o cancelar una cita
- Notificación al doctor asignado por email con archivo .ics adjunto
- Monto de la cita (opcional) y estado de pago

---

## 2. Gestión de Pacientes

- Alta, edición y baja de pacientes
- Búsqueda por nombre, email o DNI
- Importación inteligente: si el paciente ya existe en el sistema, se asigna a la clínica sin duplicar
- Datos demográficos: nombre, apellido, sexo, fecha de nacimiento, dirección, provincia
- Datos de contacto: email, teléfono, WhatsApp
- Identificación: DNI, código postal
- Estado activo / inactivo

---

## 3. Historial Clínico

- Registro de notas por consulta con fecha
- Ordenamiento cronológico (más reciente primero)
- Odontograma interactivo: marcar el estado de cada pieza dental
- Patologías y antecedentes: alergias, medicamentos habituales, enfermedades preexistentes
- Subida y descarga de documentos clínicos (radiografías, estudios, PDF, imágenes)
- Búsqueda de documentos por título o nombre de archivo

---

## 4. Gestión de Doctores

- Alta, edición y baja de profesionales
- Especialidad y número de licencia profesional
- Color personalizado por doctor (visible en calendario)
- Asignación como administrador de la clínica

---

## 5. Presupuestos

- Crear presupuestos con líneas de ítems (servicio, pieza dental, cantidad, precio unitario)
- Descuento global porcentual
- Fechas de validez configurables
- Numeración automática: P-YYYY-0001, P-YYYY-0002...
- Estados: borrador, publicado, enviado, aceptado, rechazado
- Descarga en PDF con datos de la clínica
- Notas adicionales por presupuesto

---

## 6. Finanzas

- Resumen de ingresos cobrados vs. pendientes
- Registro y categorización de gastos
- Balance neto por período (ingresos − gastos)
- Porcentaje de cobranza sobre ingresos esperados
- Filtros por rango de fechas
- Gestión de categorías de gastos personalizadas
- Dashboard con gráficos de tendencias

---

## 7. Configuración de la Clínica

- Nombre, logo, dirección, teléfono, WhatsApp, email, sitio web, horarios
- SMTP propio por clínica (cada clínica envía emails desde su propia cuenta)
- Test de configuración de email desde el panel
- Zona horaria, moneda e idioma

---

## 8. Comunicaciones Automáticas

- Email de confirmación de turno al paciente (con .ics adjunto)
- Email de cancelación de turno al paciente
- Email al doctor cuando se le asigna una nueva cita
- Todos los emails incluyen datos de la clínica (logo, dirección, teléfono, WhatsApp, horarios)
- Formulario de contacto con protección anti-spam (Turnstile CAPTCHA)
- Boton para enviar la cita a traves de whatsapp

---

---

## 14. Exportación y Reportes

- Presupuestos en PDF con diseño profesional
- Archivos .ics para agregar citas a cualquier calendario
- Reportes financieros con filtros de fecha

---

_Sistema desarrollado por [Codenix](https://www.proyectoswebsite.com/) — 2025_
