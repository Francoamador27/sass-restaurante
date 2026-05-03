import {
  Globe,
  Search,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Zap,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  MessageSquare,
  ExternalLink,
  Tv,
  Mail,
  LayoutGrid,
  Play,
  Target,
  MousePointerClick,
  BadgeCheck,
  BrainCircuit,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import WhatsappHref from "../utils/WhatsappUrl";
import useCont from "../hooks/useCont";
import SEOHead from "./Head/Head";

const PASOS = [
  {
    num: "01",
    titulo: "Consulta gratuita",
    desc: "Hablamos sobre tu consultorio, tu paciente ideal y tus objetivos. Sin compromiso.",
  },
  {
    num: "02",
    titulo: "Propuesta a medida",
    desc: "Te armamos la estrategia que mejor encaja con tu tipo de clínica y tu ciudad.",
  },
  {
    num: "03",
    titulo: "Diseño y desarrollo",
    desc: "Construimos tu sitio con foco en conversión: que el visitante se convierta en paciente.",
  },
  {
    num: "04",
    titulo: "Publicamos y crecemos",
    desc: "Lanzamos, posicionamos en Google y trabajamos para que tu agenda no pare.",
  },
];

const BENEFICIOS = [
  {
    icon: <Search className="w-6 h-6 text-[#008DD2]" />,
    titulo: "Aparecés en Google",
    desc: 'Cuando alguien busca "dentista en tu ciudad", tu consultorio aparece primero.',
  },
  {
    icon: <Smartphone className="w-6 h-6 text-[#008DD2]" />,
    titulo: "Diseño que convierte",
    desc: "Páginas rápidas y claras optimizadas para que el visitante pida turno.",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-[#008DD2]" />,
    titulo: "Contacto directo",
    desc: "Botón de WhatsApp, formulario y llamada con un solo clic desde el celular.",
  },
  {
    icon: <Star className="w-6 h-6 text-[#008DD2]" />,
    titulo: "Reputación online",
    desc: "Mostrás tus reseñas de Google, galería de trabajos y el equipo de profesionales.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#008DD2]" />,
    titulo: "Más pacientes nuevos",
    desc: "SEO local y publicidad para atraer pacientes de forma constante y predecible.",
  },
  {
    icon: <Zap className="w-6 h-6 text-[#008DD2]" />,
    titulo: "Rápido y seguro",
    desc: "SSL, carga en menos de 2 segundos, backup automático y hosting confiable.",
  },
];

function StarRating({ rating = 4.9, count = 87, size = "sm" }) {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <span className={`font-bold text-slate-800 ${size === "sm" ? "text-sm" : "text-base"}`}>{rating}</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className={`${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} ${s <= stars ? "text-yellow-400" : "text-slate-300"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className={`text-blue-600 ${size === "sm" ? "text-xs" : "text-sm"}`}>({count} reseñas)</span>
    </div>
  );
}

function ClinicWebsiteMockup() {
  const SERVICIOS = [
    { emoji: "🦷", nombre: "Ortodoncia", desc: "Brackets, alineadores y corrección de mordida para adultos y niños." },
    { emoji: "✨", nombre: "Blanqueamiento", desc: "Tratamiento profesional con resultados visibles desde la primera sesión." },
    { emoji: "🔩", nombre: "Implantes", desc: "Implantes de titanio con garantía, estética y funcionalidad natural." },
    { emoji: "🚑", nombre: "Urgencias", desc: "Atención inmediata para dolores, fracturas o pérdida de piezas dentales." },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chrome browser frame */}
      <div className="rounded-t-2xl bg-[#dee1e6] px-4 pt-3 pb-0 flex items-center gap-3 shadow-sm">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-white rounded-full px-4 py-1.5 flex items-center gap-2 mx-2">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-600 truncate font-medium">dra-garcia-odontologia.com.ar</span>
          <span className="ml-auto text-[10px] text-green-600 font-semibold flex items-center gap-0.5">🔒 Seguro</span>
        </div>
      </div>

      {/* Website body */}
      <div className="rounded-b-2xl border border-t-0 border-slate-200 shadow-2xl overflow-hidden bg-white">

        {/* ── HEADER DE LA CLÍNICA ── */}
        <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#008DD2] to-[#0070a8] flex items-center justify-center text-white text-lg shadow-sm">
              🦷
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-tight">Consultorio García</p>
              <p className="text-[10px] text-[#008DD2] font-semibold tracking-wide">ODONTOLOGÍA DE CALIDAD</p>
            </div>
          </div>
          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-5 text-xs font-semibold text-slate-600">
            {["Inicio", "Servicios", "Equipo", "Testimonios", "Contacto"].map((item, i) => (
              <span key={item} className={`cursor-default transition-colors ${i === 0 ? "text-[#008DD2]" : "hover:text-[#008DD2]"}`}>{item}</span>
            ))}
          </nav>
          {/* CTA */}
          <button className="hidden sm:flex items-center gap-1.5 bg-[#008DD2] hover:bg-[#0070a8] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm cursor-default">
            📅 Pedir turno
          </button>
        </header>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#008DD2] via-[#0070a8] to-[#005580] px-8 py-10">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute top-4 right-1/4 w-24 h-24 rounded-full bg-cyan-400/10" />

          <div className="relative flex items-center justify-between gap-6">
            {/* Text */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white/90 text-[10px] font-bold px-3 py-1 rounded-full mb-3 backdrop-blur uppercase tracking-wider">
                ⭐ 4.9 — Más de 143 reseñas en Google
              </span>
              <h1 className="text-2xl font-black text-white leading-tight mb-3">
                Tu sonrisa, nuestra<br />
                <span className="text-cyan-300">pasión de 15 años</span>
              </h1>
              <p className="text-white/75 text-xs leading-relaxed mb-5 max-w-xs">
                Ortodoncia, blanqueamiento, implantes y más. Atención personalizada
                para toda la familia en el corazón de Córdoba.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="bg-white text-[#008DD2] font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg cursor-default hover:shadow-xl transition-shadow">
                  📅 Reservar turno gratis
                </button>
                <button className="flex items-center gap-1.5 bg-green-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-default shadow-lg">
                  <FaWhatsapp className="text-sm" /> WhatsApp
                </button>
              </div>
              {/* Credenciales */}
              <div className="flex items-center gap-4 mt-5">
                {[["15+", "Años"], ["3.200+", "Pacientes"], ["⭐ 4.9", "Google"]].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-white font-black text-sm">{num}</p>
                    <p className="text-white/60 text-[10px]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual card */}
            <div className="hidden sm:flex flex-col items-center gap-3 flex-shrink-0">
              {/* Doctor card */}
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20 w-44">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 mx-auto mb-2 flex items-center justify-center text-3xl shadow-inner">
                  👩‍⚕️
                </div>
                <p className="text-white font-bold text-xs text-center">Dra. Lucía García</p>
                <p className="text-white/60 text-[10px] text-center">Odontóloga · MN 45.321</p>
                <div className="flex justify-center mt-2">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-300 text-[10px]">★</span>)}
                </div>
              </div>
              {/* Next appointment badge */}
              <div className="bg-green-500 text-white rounded-xl px-3 py-2 text-center w-44 shadow-lg">
                <p className="text-[10px] font-medium opacity-80">Próximo turno disponible</p>
                <p className="text-xs font-black">Hoy — 16:30 hs</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICIOS ── */}
        <section className="px-6 py-7 bg-slate-50/50">
          <p className="text-[11px] font-bold text-[#008DD2] uppercase tracking-widest text-center mb-1">Nuestros servicios</p>
          <h2 className="text-base font-black text-slate-900 text-center mb-5">
            Todo lo que tu sonrisa necesita
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICIOS.map((s) => (
              <div
                key={s.nombre}
                className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#008DD2]/30 transition-all cursor-default group"
              >
                <div className="text-2xl mb-2">{s.emoji}</div>
                <p className="text-xs font-black text-slate-900 mb-1 group-hover:text-[#008DD2] transition-colors">{s.nombre}</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <section className="px-6 py-6 border-t border-slate-100">
          <p className="text-[11px] font-bold text-[#008DD2] uppercase tracking-widest text-center mb-1">Testimonios</p>
          <h2 className="text-base font-black text-slate-900 text-center mb-5">Lo que dicen nuestros pacientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { nombre: "María G.", texto: "Excelente atención. Me sacaron el miedo al dentista y el resultado fue increíble.", stars: 5 },
              { nombre: "Carlos M.", texto: "El tratamiento de implantes fue impecable. Profesionalismo de primer nivel.", stars: 5 },
              { nombre: "Laura P.", texto: "Los alineadores cambiaron mi sonrisa completamente. Super recomendable.", stars: 5 },
            ].map((t) => (
              <div key={t.nombre} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex mb-2">
                  {[...Array(t.stars)].map((_, i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed italic mb-3">"{t.texto}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#008DD2] to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold">
                    {t.nombre[0]}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">{t.nombre}</span>
                  <span className="ml-auto text-[9px] text-slate-400 flex items-center gap-0.5">
                    <span className="text-[#4285F4] font-bold">G</span>oogle
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER DE LA CLÍNICA ── */}
        <footer className="bg-[#1e2d3d] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#008DD2] flex items-center justify-center text-white text-sm">🦷</div>
            <div>
              <p className="text-white text-xs font-bold">Consultorio Dra. García</p>
              <p className="text-slate-400 text-[10px]">Bv. San Juan 1234, Córdoba · (0351) 456-7890</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">Lun–Vie 9–20 · Sáb 9–13</span>
            <button className="flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-default">
              <FaWhatsapp /> Escribir
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function GoogleSearchMockup() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chrome browser frame */}
      <div className="rounded-t-xl bg-[#dee1e6] px-3 pt-2.5 pb-0 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-white rounded-full px-4 py-1 flex items-center gap-2 mx-2">
          <div className="w-3 h-3 rounded-full border-2 border-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 truncate">google.com/search?q=dentista+en+córdoba</span>
        </div>
      </div>

      {/* Browser body */}
      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-2xl overflow-hidden">
        {/* Google header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Google logo */}
            <span className="text-2xl font-bold tracking-tight select-none">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
            {/* Search bar */}
            <div className="flex-1 flex items-center gap-3 border border-slate-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow bg-white">
              <span className="text-sm text-slate-800 font-medium">dentista en córdoba</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-px h-4 bg-slate-300" />
                <Search className="w-4 h-4 text-[#4285F4]" />
              </div>
            </div>
          </div>
          {/* Nav tabs */}
          <div className="flex gap-5 mt-3 text-xs text-slate-600">
            {["Todo", "Maps", "Imágenes", "Videos", "Noticias"].map((tab, i) => (
              <span
                key={tab}
                className={`pb-2 cursor-default ${i === 0 ? "text-[#1a73e8] border-b-2 border-[#1a73e8] font-medium" : ""}`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div className="px-5 py-3">
          <p className="text-xs text-slate-500 mb-3">Aproximadamente 4.820.000 resultados (0,42 segundos)</p>

          {/* ── LOCAL PACK ── */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 shadow-sm">
            {/* Map strip */}
            <div className="h-28 bg-gradient-to-br from-[#e8f4ea] to-[#d4ebd5] relative overflow-hidden">
              {/* Map grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#888" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {/* Roads */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/70 -translate-y-1/2" />
                <div className="absolute left-1/3 top-0 bottom-0 w-1.5 bg-white/70" />
                <div className="absolute left-2/3 top-0 bottom-0 w-1.5 bg-white/70" />
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-white/50" />
              </div>
              {/* Pins */}
              <div className="absolute top-8 left-[30%] flex flex-col items-center">
                <div className="w-7 h-7 bg-[#1a73e8] rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold z-10">1</div>
                <div className="w-2 h-2 bg-[#1a73e8] rotate-45 -mt-1" />
              </div>
              <div className="absolute top-12 left-[55%] flex flex-col items-center">
                <div className="w-6 h-6 bg-slate-500 rounded-full border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold z-10">2</div>
                <div className="w-1.5 h-1.5 bg-slate-500 rotate-45 -mt-0.5" />
              </div>
              <div className="absolute top-6 left-[72%] flex flex-col items-center">
                <div className="w-6 h-6 bg-slate-500 rounded-full border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold z-10">3</div>
                <div className="w-1.5 h-1.5 bg-slate-500 rotate-45 -mt-0.5" />
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 bg-white/70 px-1 rounded">Mapa de Google</span>
            </div>

            {/* Local results list */}
            <div className="divide-y divide-slate-100">
              {/* Result 1 — FEATURED */}
              <div className="px-4 py-3 bg-blue-50/50 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#1a0dab]">Consultorio Dra. García — Odontología</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Sitio web</span>
                  </div>
                  <StarRating rating={4.9} count={143} />
                  <p className="text-xs text-slate-600 mt-0.5">Dentista · Bv. San Juan 1234, Córdoba</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3 text-green-600" /><span className="text-green-600 font-medium">Abierto ahora</span> · Cierra a las 20:00</span>
                    <span className="text-xs text-[#1a73e8] flex items-center gap-1 cursor-default"><Phone className="w-3 h-3" /> (0351) 456-7890</span>
                  </div>
                </div>
              </div>
              {/* Result 2 */}
              <div className="px-4 py-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#1a0dab]">Clínica Dental del Centro</span>
                  <StarRating rating={4.3} count={58} />
                  <p className="text-xs text-slate-500">Dentista · San Martín 890, Córdoba</p>
                </div>
              </div>
              {/* Result 3 */}
              <div className="px-4 py-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#1a0dab]">OdontoSalud Córdoba</span>
                  <StarRating rating={4.1} count={32} />
                  <p className="text-xs text-slate-500">Dentista · Av. Colón 560, Córdoba</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── ORGANIC RESULT ── */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-full bg-[#EAF7FD] flex items-center justify-center overflow-hidden">
                <Globe className="w-3 h-3 text-[#008DD2]" />
              </div>
              <div>
                <p className="text-xs text-slate-800 font-medium">dra-garcia-odontologia.com.ar</p>
                <p className="text-xs text-slate-500">https://dra-garcia-odontologia.com.ar</p>
              </div>
            </div>
            <a className="text-lg text-[#1a0dab] hover:underline font-medium cursor-default block">
              Dra. García — Odontología General y Estética · Córdoba
            </a>
            <p className="text-sm text-slate-600 leading-relaxed">
              Consultorio odontológico con más de 15 años de experiencia. Blanqueamiento, ortodoncia, implantes y urgencias. <span className="font-medium">Pedí tu turno online</span> o escribinos por WhatsApp. ⭐ 4.9 en Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleMapsMockup() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chrome frame */}
      <div className="rounded-t-xl bg-[#dee1e6] px-3 pt-2.5 pb-0 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-white rounded-full px-4 py-1 flex items-center gap-2 mx-2">
          <div className="w-3 h-3 rounded-full border-2 border-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 truncate">maps.google.com</span>
        </div>
      </div>

      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-2xl overflow-hidden flex" style={{ height: 340 }}>
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-slate-200 flex flex-col">
          {/* Search bar inside maps */}
          <div className="p-3 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-full px-3 py-1.5 shadow-sm">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-700">Consultorio Dra. García</span>
            </div>
          </div>

          {/* Business card */}
          <div className="p-4 flex-1">
            <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">
              Consultorio Dra. García — Odontología
            </h3>
            <StarRating rating={4.9} count={143} size="md" />
            <p className="text-xs text-slate-500 mt-1 mb-3">Dentista · Abierto · ★ Muy valorado en la zona</p>

            {/* Action buttons */}
            <div className="flex gap-2 mb-4">
              {[
                { label: "Cómo llegar", icon: <MapPin className="w-4 h-4" /> },
                { label: "Llamar", icon: <Phone className="w-4 h-4" /> },
                { label: "Sitio web", icon: <Globe className="w-4 h-4" /> },
              ].map((btn) => (
                <button
                  key={btn.label}
                  className="flex flex-col items-center gap-0.5 flex-1 bg-[#EAF7FD] hover:bg-[#d0edf8] rounded-lg py-2 px-1 transition-colors cursor-default"
                >
                  <span className="text-[#1a73e8]">{btn.icon}</span>
                  <span className="text-[10px] text-[#1a73e8] font-medium">{btn.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>Bv. San Juan 1234, X5000 Córdoba</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-green-600 font-medium">Abierto ahora</span>
                  <span className="text-slate-500"> · Cierra a las 20:00</span>
                  <div className="text-slate-400 mt-0.5">Lun–Vie 9:00–20:00 · Sáb 9:00–13:00</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-[#1a73e8]">(0351) 456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-[#1a73e8] truncate">dra-garcia-odontologia.com.ar</span>
              </div>
            </div>

            {/* Reviews preview */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-2">Reseñas destacadas</p>
              <div className="bg-slate-50 rounded-lg p-2.5">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <svg key={s} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">"Excelente atención, muy profesional. Me sacó el miedo al dentista para siempre. 100% recomendable."</p>
                <p className="text-[10px] text-slate-400 mt-1">— María G. · hace 2 semanas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map area */}
        <div className="flex-1 bg-gradient-to-br from-[#e8f4ea] to-[#d4ebd5] relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#888" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapgrid)" />
          </svg>
          {/* Roads */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/80 -translate-y-1/2 shadow-sm" />
            <div className="absolute top-1/4 left-0 right-0 h-2 bg-white/60" />
            <div className="absolute top-3/4 left-0 right-0 h-2 bg-white/60" />
            <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-white/70" />
            <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-white/80 shadow-sm" />
            <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-white/60" />
            {/* Blocks */}
            <div className="absolute top-[15%] left-[10%] w-[14%] h-[25%] bg-[#c8dfca]/60 rounded" />
            <div className="absolute top-[15%] left-[28%] w-[18%] h-[25%] bg-[#c8dfca]/60 rounded" />
            <div className="absolute top-[55%] left-[10%] w-[14%] h-[22%] bg-[#c8dfca]/60 rounded" />
            <div className="absolute top-[55%] left-[28%] w-[18%] h-[22%] bg-[#c8dfca]/60 rounded" />
            <div className="absolute top-[15%] left-[55%] w-[18%] h-[25%] bg-[#c8dfca]/60 rounded" />
            <div className="absolute top-[55%] left-[55%] w-[18%] h-[22%] bg-[#c8dfca]/60 rounded" />
            <div className="absolute top-[15%] left-[77%] w-[18%] h-[60%] bg-[#c8dfca]/60 rounded" />
          </div>
          {/* Main pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center z-10">
            <div className="bg-[#EA4335] rounded-full rounded-bl-none w-10 h-10 border-2 border-white shadow-xl flex items-center justify-center rotate-45">
              <div className="-rotate-45">
                <MapPin className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>
          {/* Info bubble */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl px-3 py-2 text-xs font-semibold text-slate-800 whitespace-nowrap border border-slate-200">
            Consultorio Dra. García
            <div className="text-[10px] text-yellow-500 font-normal flex items-center gap-0.5">
              ★★★★★ <span className="text-slate-400">4.9 (143)</span>
            </div>
          </div>
          <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 bg-white/70 px-1 rounded">© Google Maps</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PMAX SECTION
───────────────────────────────────────────── */
const PMAX_CANALES = [
  { icon: Search,     label: "Google Search",   desc: "Aparecés cuando alguien busca activamente",  color: "text-[#4285F4]", bg: "bg-blue-50",   border: "border-blue-200" },
  { icon: LayoutGrid, label: "Display (banners)",desc: "Banners en millones de sitios web y apps",    color: "text-[#EA4335]", bg: "bg-red-50",    border: "border-red-200" },
  { icon: Play,       label: "YouTube",          desc: "Anuncios antes o durante videos populares",   color: "text-[#FF0000]", bg: "bg-rose-50",   border: "border-rose-200" },
  { icon: Mail,       label: "Gmail",            desc: "Llegás directo a la bandeja de entrada",      color: "text-[#34A853]", bg: "bg-green-50",  border: "border-green-200" },
  { icon: MapPin,     label: "Google Maps",      desc: "Tu anuncio en búsquedas locales del mapa",   color: "text-[#FBBC05]", bg: "bg-amber-50",  border: "border-amber-200" },
  { icon: Smartphone, label: "Google Discover",  desc: "Feed personalizado en Android e iOS",         color: "text-[#008DD2]", bg: "bg-cyan-50",   border: "border-cyan-200" },
];

const PMAX_VENTAJAS = [
  { icon: BrainCircuit, titulo: "IA de Google trabaja para vos",   desc: "El algoritmo aprende qué anuncios, horarios y audiencias generan más turnos para tu consultorio y los optimiza solo." },
  { icon: Target,       titulo: "Solo pagás por resultados",        desc: "Pagás cuando alguien hace clic en tu anuncio y llega a tu sitio. Sin presupuesto mínimo, sin compromisos." },
  { icon: MousePointerClick, titulo: "Alcance total en Google",   desc: "Una sola campaña te pone en Search, YouTube, Gmail, Maps y Display al mismo tiempo — sin configurar cada canal por separado." },
  { icon: TrendingUp,   titulo: "Escalable y medible",              desc: "Ves exactamente cuántas personas vieron tu anuncio, cuántas hicieron clic y cuántas pidieron turno." },
];

function PmaxSearchAdMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"/><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"/><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"/></div>
        <div className="flex-1 bg-white rounded-full px-3 py-1 flex items-center gap-2">
          <Search className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-600">dentista implantes córdoba</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-xs text-slate-400 mb-3">Patrocinado</p>
        {/* Ad result */}
        <div className="mb-4 p-3 border border-[#4285F4]/20 rounded-xl bg-blue-50/30">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] border border-slate-400 text-slate-600 px-1.5 py-0.5 rounded font-semibold">Anuncio</span>
            <span className="text-xs text-slate-500">· dra-garcia-odontologia.com.ar</span>
          </div>
          <p className="text-base text-[#1a0dab] font-semibold leading-snug cursor-default hover:underline">
            Implantes Dentales en Córdoba — Consulta Sin Cargo
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-1">
            Implantes de titanio con garantía de por vida. Atención personalizada, financiación en cuotas. ⭐ 4.9 — Más de 140 pacientes satisfechos.
          </p>
          {/* Ad extensions */}
          <div className="flex flex-wrap gap-3 mt-2.5">
            {["📅 Reservar turno", "📞 Llamar ahora", "💬 WhatsApp", "📍 Cómo llegar"].map(ext => (
              <span key={ext} className="text-xs text-[#1a73e8] border border-[#1a73e8]/30 rounded px-2 py-0.5 cursor-default hover:bg-blue-50">{ext}</span>
            ))}
          </div>
        </div>
        {/* Organic result below */}
        <div className="opacity-50">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="w-4 h-4 rounded-full bg-slate-200"/><span className="text-xs text-slate-400">odontologiacentro.com.ar</span>
          </div>
          <p className="text-sm text-slate-400">Clínica Dental del Centro — Córdoba Capital</p>
          <p className="text-xs text-slate-300 mt-0.5">Odontología general. Turnos disponibles esta semana...</p>
        </div>
      </div>
    </div>
  );
}

function PmaxDisplayMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"/><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"/><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"/></div>
        <div className="flex-1 bg-white rounded-full px-3 py-1"><span className="text-xs text-slate-500">revista-salud.com.ar/nota-dental</span></div>
      </div>
      {/* Simulated article page with banner */}
      <div className="p-4">
        {/* Article content */}
        <div className="mb-4">
          <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"/><div className="h-2 bg-slate-100 rounded w-full mb-1"/><div className="h-2 bg-slate-100 rounded w-5/6 mb-1"/><div className="h-2 bg-slate-100 rounded w-4/5"/>
        </div>
        {/* Display banner ad */}
        <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-[#4285F4]/30 bg-gradient-to-r from-[#008DD2] to-[#0070a8]">
          <div className="absolute top-1.5 right-2 text-[9px] text-white/60 font-medium">Anuncio</div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🦷</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm leading-tight">¿Necesitás un implante?</p>
              <p className="text-white/80 text-xs mt-0.5">Consultorio Dra. García · Córdoba</p>
              <p className="text-white/70 text-xs">Desde $85.000 · Financiamos en cuotas</p>
            </div>
            <button className="flex-shrink-0 bg-white text-[#008DD2] font-black text-xs px-3 py-2 rounded-lg shadow cursor-default">
              Ver más
            </button>
          </div>
        </div>
        {/* More article content */}
        <div className="mt-4">
          <div className="h-2 bg-slate-100 rounded w-full mb-1"/><div className="h-2 bg-slate-100 rounded w-4/5 mb-1"/><div className="h-2 bg-slate-100 rounded w-3/4"/>
        </div>
      </div>
    </div>
  );
}

function PmaxYoutubeMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-[#0f0f0f] px-4 py-2 flex items-center justify-between">
        <span className="text-white font-black text-sm tracking-tight">
          <span className="text-[#FF0000]">You</span>Tube
        </span>
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"/><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"/><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"/></div>
      </div>
      {/* Video player */}
      <div className="bg-black relative" style={{ paddingTop: "52%" }}>
        {/* Fake video background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <div className="text-center opacity-40">
            <Play className="w-12 h-12 text-white mx-auto mb-1" />
            <p className="text-white text-xs">Video: Cómo hacer una limpieza...</p>
          </div>
        </div>
        {/* Pre-roll overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-[#008DD2] rounded-lg flex items-center justify-center text-lg flex-shrink-0">🦷</div>
              <div className="min-w-0">
                <span className="text-[10px] bg-yellow-400 text-slate-900 font-bold px-1.5 py-0.5 rounded mr-1">Anuncio</span>
                <p className="text-white text-xs font-bold mt-1 leading-tight">Blanqueamiento dental desde $25.000</p>
                <p className="text-white/70 text-[10px]">Consultorio Dra. García · Córdoba · 4.9 ⭐</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <button className="bg-white text-slate-800 font-bold text-xs px-3 py-1.5 rounded cursor-default">Reservar turno</button>
              <span className="text-white/60 text-[10px]">Saltar en 3 s →</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#0f0f0f] px-4 py-2 flex items-center gap-2">
        <div className="flex-1 bg-slate-800 rounded-full h-1"><div className="bg-[#FF0000] h-full rounded-full w-1/12"/></div>
        <span className="text-white/40 text-[10px]">0:04 / 8:23</span>
      </div>
    </div>
  );
}

function PmaxGmailMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-white px-4 py-2.5 flex items-center gap-3 border-b border-slate-100">
        <span className="font-black text-xl tracking-tight">
          <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">m</span><span className="text-[#FBBC05]">a</span><span className="text-[#34A853]">i</span><span className="text-[#EA4335]">l</span>
        </span>
        <div className="flex-1 bg-slate-100 rounded-full px-3 py-1 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400"/><span className="text-xs text-slate-400">Buscar correo</span>
        </div>
      </div>
      <div className="flex" style={{ height: 220 }}>
        {/* Sidebar */}
        <div className="w-28 bg-slate-50 border-r border-slate-100 p-3 space-y-1">
          {["Recibidos", "Destacados", "Enviados", "Borradores"].map((f, i) => (
            <div key={f} className={`text-xs px-2 py-1.5 rounded-full cursor-default ${i === 0 ? "bg-[#D3E3FD] text-[#0b57d0] font-bold" : "text-slate-500"}`}>{f}</div>
          ))}
        </div>
        {/* Inbox */}
        <div className="flex-1 overflow-hidden">
          {/* Sponsored top */}
          <div className="border-b border-slate-100 px-4 py-2.5 bg-green-50/60 cursor-default hover:bg-green-50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#008DD2] rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">DG</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Consultorio Dra. García</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] border border-slate-400 text-slate-500 px-1 rounded">Promoción</span>
                    <span className="text-[10px] text-slate-400">Ahora</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 truncate font-medium">🦷 Tu sonrisa merece lo mejor — 1ra consulta sin cargo</p>
                <p className="text-[10px] text-slate-400 truncate">Blanqueamiento, ortodoncia e implantes en Córdoba. Pedí tu turno hoy y...</p>
              </div>
            </div>
          </div>
          {/* Regular emails */}
          {[
            { from: "Dr. Pérez", sub: "Resultado de tu análisis", time: "10:30", read: true },
            { from: "Farmacia Online", sub: "Tu pedido fue enviado", time: "9:15", read: true },
            { from: "Banco Nación", sub: "Resumen de cuenta", time: "Ayer", read: true },
          ].map((e) => (
            <div key={e.from} className="border-b border-slate-50 px-4 py-2 cursor-default hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-bold flex-shrink-0">{e.from[0]}</div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 truncate">{e.from} — {e.sub}</span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{e.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PmaxSection({ waHref }) {
  return (
    <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 10% 50%, #4285F4 0%, transparent 45%), radial-gradient(circle at 90% 20%, #EA4335 0%, transparent 40%), radial-gradient(circle at 50% 90%, #34A853 0%, transparent 40%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-bold px-4 py-2 rounded-full mb-5 backdrop-blur border border-white/10">
            <Target className="w-4 h-4 text-yellow-400" />
            Campañas Performance Max · Google Ads
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Tu consultorio en{" "}
            <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853] bg-clip-text text-transparent">
              todos los canales de Google
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Performance Max es la campaña más poderosa de Google. La IA de
            Google decide automáticamente dónde, cuándo y a quién mostrar tu
            anuncio para conseguirte más pacientes al menor costo.
          </p>
        </div>

        {/* Qué es PMax — explicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {PMAX_VENTAJAS.map((v) => (
            <div key={v.titulo} className="bg-white/8 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/12 transition-colors">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-white font-black text-base mb-2">{v.titulo}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Dónde aparecen tus anuncios */}
        <div className="mb-16">
          <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mb-6">
            Una sola campaña · Todos estos canales
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PMAX_CANALES.map((c) => (
              <div key={c.label} className={`${c.bg} rounded-2xl p-4 text-center border ${c.border} hover:scale-105 transition-transform`}>
                <c.icon className={`w-6 h-6 ${c.color} mx-auto mb-2`} />
                <p className="text-xs font-black text-slate-800 leading-tight mb-1">{c.label}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mockups de anuncios */}
        <div className="mb-12">
          <h3 className="text-center text-white font-black text-xl mb-2">
            Ejemplos de cómo ven tu anuncio
          </h3>
          <p className="text-center text-white/50 text-sm mb-10">
            Así aparecería tu consultorio en cada canal de Google
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Search */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#4285F4] rounded-lg flex items-center justify-center">
                  <Search className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold text-sm">Búsqueda de Google</span>
                <span className="text-white/40 text-xs">— cuando alguien busca activamente</span>
              </div>
              <PmaxSearchAdMockup />
            </div>

            {/* Display */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#EA4335] rounded-lg flex items-center justify-center">
                  <LayoutGrid className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold text-sm">Banner en sitios web</span>
                <span className="text-white/40 text-xs">— mientras navega por internet</span>
              </div>
              <PmaxDisplayMockup />
            </div>

            {/* YouTube */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#FF0000] rounded-lg flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold text-sm">Anuncio en YouTube</span>
                <span className="text-white/40 text-xs">— antes de un video relacionado</span>
              </div>
              <PmaxYoutubeMockup />
            </div>

            {/* Gmail */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#34A853] rounded-lg flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold text-sm">Gmail Sponsored</span>
                <span className="text-white/40 text-xs">— en la bandeja de entrada</span>
              </div>
              <PmaxGmailMockup />
            </div>
          </div>
        </div>

        {/* Stats / resultados típicos */}
        <div className="bg-white/8 backdrop-blur rounded-3xl border border-white/10 p-8 mb-10">
          <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mb-6">Resultados típicos con PMax para consultorios</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { valor: "3x", label: "Más alcance vs. campaña tradicional", color: "text-[#4285F4]" },
              { valor: "↓40%", label: "Menor costo por clic gracias a la IA", color: "text-[#34A853]" },
              { valor: "+65%", label: "Más consultas nuevas en los primeros 60 días", color: "text-yellow-400" },
              { valor: "24/7", label: "Tu anuncio activo mientras dormís", color: "text-[#EA4335]" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-3xl font-black ${s.color} mb-1`}>{s.valor}</p>
                <p className="text-white/50 text-xs leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-white/60 text-sm mb-4">Sin permanencia mínima · Reportes mensuales incluidos</p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-green-500/40 transition-all hover:scale-105 text-base"
          >
            <FaWhatsapp className="text-xl" />
            Quiero campañas PMax para mi clínica
          </a>
        </div>
      </div>
    </section>
  );
}

export default function PaginasWeb() {
  const { company } = useCont();
  const waHref = WhatsappHref({
    message:
      "Hola, me interesa una página web para mi consultorio. ¿Podemos hablar?",
  });

  return (
    <div className="bg-white">
      <SEOHead
        title="Páginas Web para Consultorios Odontológicos | DentalCor"
        description="Diseñamos páginas web profesionales para dentistas y clínicas dentales. SEO local, Google Maps y estrategias para conseguir más pacientes."
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#008DD2] via-[#0070a8] to-[#005580] py-24 px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#ffffff_0%,_transparent_60%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur">
            <Globe className="w-4 h-4" />
            Diseño web para odontología
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Hacé que tu consultorio
            <br />
            <span className="text-cyan-300">aparezca primero en Google</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Creamos tu página web y la posicionamos para que cuando alguien
            busque un dentista en tu ciudad, te encuentre a vos — no a la
            competencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-green-500/40 transition-all hover:scale-105"
            >
              <FaWhatsapp className="text-xl" />
              Consulta gratuita por WhatsApp
            </a>
            <a
              href="#como-te-ven"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl backdrop-blur border border-white/30 transition-all"
            >
              Ver cómo funciona
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ── */}
      <section className="py-20 px-6 bg-[#F5FBFE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              ¿Por qué necesitás una buena página web?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              El 90% de las personas busca servicios de salud en Google antes de
              llamar. Si no aparecés, esos pacientes van a tu competencia.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFICIOS.map((b) => (
              <div
                key={b.titulo}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#EAF7FD] rounded-xl flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{b.titulo}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WEBSITE MOCKUP ── */}
      <section className="py-20 px-6 bg-slate-900 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #008DD2 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0070a8 0%, transparent 40%)" }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-cyan-400 font-semibold bg-white/10 px-4 py-1.5 rounded-full text-sm mb-4 backdrop-blur">
              <Globe className="w-4 h-4" />
              Ejemplo real
            </span>
            <h2 className="text-3xl font-black text-white mb-3">
              Así quedaría el sitio de tu consultorio
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Diseño profesional, moderno y optimizado para convertir visitantes
              en pacientes. Personalizado con tus colores, fotos y servicios.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-cyan-500/10 rounded-3xl blur-3xl" />
            <ClinicWebsiteMockup />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { icon: "🎨", text: "Diseño personalizado con tu identidad" },
              { icon: "📱", text: "100% adaptado a celular" },
              { icon: "⚡", text: "Carga en menos de 2 segundos" },
              { icon: "🔍", text: "Optimizado para aparecer en Google" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 bg-white/10 backdrop-blur text-white/80 rounded-full px-4 py-2 text-sm font-medium">
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOOGLE SEARCH MOCKUP ── */}
      <section id="como-te-ven" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[#008DD2] font-semibold bg-[#EAF7FD] px-4 py-1.5 rounded-full text-sm mb-4">
              <Search className="w-4 h-4" />
              Resultados de Google
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Así te encuentran tus futuros pacientes
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Cuando alguien escribe <strong>"dentista en tu ciudad"</strong>,
              tu consultorio aparece en los primeros resultados — antes que
              cualquier competidor.
            </p>
          </div>

          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#008DD2]/10 to-cyan-400/10 rounded-3xl blur-2xl" />
            <GoogleSearchMockup />
          </div>

          {/* Arrow + label */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2.5 text-sm font-semibold text-green-700">
              <CheckCircle className="w-4 h-4" />
              Tu consultorio en el primer resultado — siempre visible para quien busca
            </div>
          </div>
        </div>
      </section>

      {/* ── GOOGLE MAPS MOCKUP ── */}
      <section className="py-20 px-6 bg-[#F5FBFE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[#EA4335] font-semibold bg-red-50 px-4 py-1.5 rounded-full text-sm mb-4">
              <MapPin className="w-4 h-4" />
              Google Maps
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              También te encontramos en el mapa
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Tu ficha de Google Business Profile completa y optimizada: dirección,
              horarios, fotos, reseñas y teléfono. Todo actualizado.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-3xl blur-2xl" />
            <GoogleMapsMockup />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "Perfil de Google verificado ✓",
              "Reseñas reales de pacientes ✓",
              "Aparecés en búsquedas locales ✓",
            ].map((item) => (
              <span key={item} className="bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PMAX ── */}
      <PmaxSection waHref={waHref} />

      {/* ── PROCESO ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Cómo trabajamos
            </h2>
            <p className="text-slate-500">Simple, rápido y sin tecnicismos.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PASOS.map((paso) => (
              <div
                key={paso.num}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
              >
                <span className="text-4xl font-black text-[#008DD2]/15 leading-none flex-shrink-0">
                  {paso.num}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{paso.titulo}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#008DD2] to-[#005580]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            ¿Listo para que te encuentren?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Escribinos por WhatsApp y en menos de 24 horas te mostramos cómo
            puede crecer tu consultorio con presencia digital real.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-green-500/40 transition-all hover:scale-105 text-lg"
          >
            <FaWhatsapp className="text-2xl" />
            Quiero crecer con mi página web
          </a>
        </div>
      </section>
    </div>
  );
}
