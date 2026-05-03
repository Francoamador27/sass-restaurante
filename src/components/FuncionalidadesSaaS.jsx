import { useState } from "react";
import {
  CalendarCheck,
  Users,
  FileText,
  UserCog,
  DollarSign,
  TrendingUp,
  Bell,
  Shield,
  Building2,
  Download,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  FolderOpen,
  BarChart3,
  Mail,
  Lock,
  Globe,
  Receipt,
  Clock,
} from "lucide-react";

const MODULOS = [
  {
    id: "agenda",
    icon: CalendarCheck,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    titulo: "Agenda y Calendario",
    subtitulo: "Organizá todos los turnos de tu clínica en un solo lugar",
    descripcion:
      "Calendario visual con vistas diaria, semanal y mensual. Gestioná turnos de múltiples profesionales al mismo tiempo, con código de color por doctor para identificarlos de un vistazo.",
    features: [
      "Vista diaria, semanal, mensual y de lista",
      "Crear, editar y cancelar citas con un clic",
      "Código de color por doctor en el calendario",
      "Notificación automática al paciente al agendar o cancelar",
      "Exportar cita a Google Calendar, Outlook o Apple Calendar",
      "Monto de la cita y estado de pago integrados",
    ],
    seo: "software de agenda para dentistas",
  },
  {
    id: "pacientes",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    titulo: "Gestión de Pacientes",
    subtitulo: "Toda la información de tus pacientes centralizada",
    descripcion:
      "Alta, búsqueda, edición y seguimiento de cada paciente. Si el paciente ya existe en el sistema, se asigna a tu clínica sin duplicar datos. Búsqueda instantánea por nombre, DNI o email.",
    features: [
      "Alta, edición y baja de pacientes",
      "Búsqueda por nombre, email o DNI",
      "Importación inteligente sin duplicar registros",
      "Datos demográficos, de contacto e identificación",
      "Estado activo / inactivo por paciente",
      "Portal exclusivo del paciente para ver sus turnos",
    ],
    seo: "gestión de pacientes odontología",
  },
  {
    id: "historial",
    icon: Stethoscope,
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    titulo: "Historial Clínico Digital",
    subtitulo: "El expediente completo de cada paciente, siempre disponible",
    descripcion:
      "Odontograma interactivo, notas de consultas, patologías, alergias y documentos clínicos. Todo el historial organizado cronológicamente y accesible desde cualquier dispositivo.",
    features: [
      "Odontograma interactivo pieza por pieza",
      "Registro de notas y evoluciones por consulta",
      "Alergias, medicamentos y enfermedades preexistentes",
      "Subida de radiografías, estudios y documentos PDF",
      "Descarga y búsqueda de archivos del paciente",
      "Historial ordenado con la última consulta primero",
    ],
    seo: "historia clínica digital odontología",
  },
  {
    id: "doctores",
    icon: UserCog,
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    titulo: "Gestión de Profesionales",
    subtitulo: "Administrá tu equipo de doctores con facilidad",
    descripcion:
      "Registrá a cada profesional con su especialidad, matrícula y color identificatorio. Asignales acceso como administradores cuando lo necesites. El calendario refleja los turnos de cada doctor en su color.",
    features: [
      "Alta, edición y baja de profesionales",
      "Especialidad y número de licencia/matrícula",
      "Color personalizado por doctor en el calendario",
      "Asignación de rol administrador de la clínica",
      "Notificación automática al doctor al asignarle una cita",
      "Control de acceso por perfil profesional",
    ],
    seo: "gestión de doctores software odontológico",
  },
  {
    id: "presupuestos",
    icon: Receipt,
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    titulo: "Presupuestos Profesionales",
    subtitulo: "Generá y enviá presupuestos en segundos",
    descripcion:
      "Creá presupuestos detallados por tratamiento con numeración automática, descuentos y fechas de validez. Descargalos en PDF con el diseño y los datos de tu clínica listos para entregar al paciente.",
    features: [
      "Ítems por servicio, pieza dental, cantidad y precio",
      "Descuento global porcentual por presupuesto",
      "Numeración automática: P-2025-0001, P-2025-0002...",
      "Estados: borrador, enviado, aceptado, rechazado",
      "Descarga en PDF con datos de tu clínica",
      "Fechas de validez y notas adicionales",
    ],
    seo: "presupuestos odontológicos en PDF",
  },
  {
    id: "finanzas",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    titulo: "Control Financiero",
    subtitulo: "Conocé los números de tu clínica en tiempo real",
    descripcion:
      "Dashboard financiero con ingresos cobrados, pendientes, gastos categorizados y balance neto. Filtrá por período y tomá decisiones basadas en datos reales, no en intuición.",
    features: [
      "Ingresos cobrados vs. pendientes del período",
      "Porcentaje de cobranza sobre lo esperado",
      "Registro y categorización de gastos",
      "Balance neto: ingresos menos gastos",
      "Filtros por rango de fechas personalizables",
      "Gráficos de tendencias del dashboard",
    ],
    seo: "finanzas para clínica dental",
  },
  {
    id: "comunicaciones",
    icon: Bell,
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-200",
    titulo: "Comunicaciones Automáticas",
    subtitulo: "Notificaciones por email y WhatsApp sin esfuerzo",
    descripcion:
      "El sistema avisa automáticamente al paciente cuando su turno es creado o cancelado, y al doctor cuando le asignan una cita. Cada email incluye los datos de tu clínica y un archivo .ics para agregar el turno al calendario.",
    features: [
      "Email de confirmación de turno al paciente",
      "Email de cancelación con opción de reprogramar",
      "Email al doctor con archivo .ics adjunto",
      "Emails con logo, dirección y datos de la clínica",
      "Botón de WhatsApp integrado en el sitio",
      "SMTP propio por clínica — los mails salen desde tu cuenta",
    ],
    seo: "notificaciones automáticas por email y WhatsApp odontología",
  },

  {
    id: "reportes",
    icon: BarChart3,
    color: "from-teal-500 to-cyan-500",
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200",
    titulo: "Exportación y Reportes",
    subtitulo: "Toda la información lista para usar fuera del sistema",
    descripcion:
      "Exportá presupuestos en PDF, enviá archivos .ics para que los pacientes agreguen sus turnos al calendario y accedé a reportes financieros con filtros de fecha. La información de tu clínica, siempre en tus manos.",
    features: [
      "Presupuestos en PDF con diseño profesional",
      "Archivos .ics para Google Calendar y Outlook",
      "Reportes financieros con filtros de fecha",
      "Descarga de documentos clínicos del paciente",
      "Dashboard exportable con métricas clave",
      "Datos accesibles desde cualquier dispositivo",
    ],
    seo: "reportes odontológicos exportar PDF",
  },
];

export default function FuncionalidadesSaaS() {
  const [activo, setActivo] = useState("agenda");
  const modActivo = MODULOS.find((m) => m.id === activo);

  return (
    <section
      className="py-24 bg-white"
      aria-labelledby="funcionalidades-titulo"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Encabezado SEO ── */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-[#EAF7FD] text-[#008DD2] text-sm font-bold px-4 py-2 rounded-full mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Software de gestión odontológica completo
          </span>
          <h2
            id="funcionalidades-titulo"
            className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-5"
          >
            Todo lo que tu clínica necesita,
            <br />
            <span className="bg-gradient-to-r from-[#008DD2] to-cyan-500 bg-clip-text text-transparent">
              en una sola plataforma
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Desde la agenda hasta las finanzas. DentalCor centraliza la gestión
            de tu consultorio para que vos te concentres en lo que importa:
            atender pacientes.
          </p>
        </div>

        {/* ── Layout principal: tabs + detalle ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Columna de tabs */}
          <nav
            className="flex flex-row flex-wrap lg:flex-col gap-2 lg:w-72 flex-shrink-0"
            aria-label="Módulos del sistema"
          >
            {MODULOS.map((m) => {
              const Icon = m.icon;
              const isActive = activo === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActivo(m.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 w-full ${
                    isActive
                      ? `bg-gradient-to-r ${m.color} text-white shadow-lg scale-[1.02]`
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                  aria-pressed={isActive}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-white/20" : m.bg}`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : m.text}`}
                    />
                  </div>
                  <span className="text-sm font-semibold leading-tight">
                    {m.titulo}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Panel de detalle */}
          {modActivo && (
            <div className="flex-1 min-w-0">
              <div
                className={`rounded-2xl border-2 ${modActivo.border} overflow-hidden shadow-lg`}
              >
                {/* Header del panel */}
                <div
                  className={`bg-gradient-to-r ${modActivo.color} px-8 py-7`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <modActivo.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">
                        {modActivo.titulo}
                      </h3>
                      <p className="text-white/80 text-sm font-medium">
                        {modActivo.subtitulo}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    {modActivo.descripcion}
                  </p>
                </div>

                {/* Features list */}
                <div className="bg-white px-8 py-7">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">
                    Funcionalidades incluidas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {modActivo.features.map((f) => (
                      <div
                        key={f}
                        className={`flex items-start gap-3 p-3 rounded-xl ${modActivo.bg} border ${modActivo.border}`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${modActivo.text} flex-shrink-0 mt-0.5`}
                        />
                        <span className="text-sm text-slate-700 font-medium leading-snug">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mini navegación entre módulos */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    const idx = MODULOS.findIndex((m) => m.id === activo);
                    if (idx > 0) setActivo(MODULOS[idx - 1].id);
                  }}
                  disabled={MODULOS.findIndex((m) => m.id === activo) === 0}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  {MODULOS.findIndex((m) => m.id === activo) + 1} /{" "}
                  {MODULOS.length} módulos
                </span>
                <button
                  onClick={() => {
                    const idx = MODULOS.findIndex((m) => m.id === activo);
                    if (idx < MODULOS.length - 1)
                      setActivo(MODULOS[idx + 1].id);
                  }}
                  disabled={
                    MODULOS.findIndex((m) => m.id === activo) ===
                    MODULOS.length - 1
                  }
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Resumen de todos los módulos (grilla oculta para SEO) ── */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MODULOS.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActivo(m.id);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:shadow-md cursor-pointer ${
                  activo === m.id
                    ? `${m.border} ${m.bg} shadow-md`
                    : "border-slate-100 bg-slate-50 hover:border-slate-200"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg}`}
                >
                  <Icon className={`w-5 h-5 ${m.text}`} />
                </div>
                <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                  {m.titulo}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── CTA ── */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-br from-[#008DD2]/5 to-cyan-500/5 border border-[#008DD2]/20 rounded-3xl px-10 py-8">
            <p className="text-2xl font-black text-slate-900 mb-2">
              ¿Querés ver cómo funciona en tu clínica?
            </p>
            <p className="text-slate-500 mb-6">
              Primer mes gratuito · Sin tarjeta · Setup incluido
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#008DD2] to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-[#008DD2]/30 hover:scale-105 transition-all"
            >
              Empezar prueba gratuita
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
