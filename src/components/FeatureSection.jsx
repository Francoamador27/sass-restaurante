import React, { useState, useEffect } from 'react';
import {
  CalendarCheck, Users, TrendingUp, Bell, Shield, Zap,
  BarChart3, CheckCircle2, ArrowRight, Star, Award,
  Sparkles, Rocket, DollarSign, FileText, Lock, Cloud,
  UserCog, CreditCard, Mail, Send, ChevronRight,
  Stethoscope, Receipt, Building2, Clock, Phone,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import WhatsappHref from '../utils/WhatsappUrl';

const OUTCOMES = [
  {
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    titulo: 'Ahorrá 15 hs/semana',
    desc: 'Automatizá recordatorios, confirmaciones y gestión de turnos.',
  },
  {
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    titulo: 'Más pacientes, menos ausencias',
    desc: 'Emails y WhatsApp automáticos reducen inasistencias hasta un 70%.',
  },
  {
    icon: TrendingUp,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    titulo: 'Control total de tus finanzas',
    desc: 'Dashboard en tiempo real con ingresos, gastos y cobros pendientes.',
  },
];

const FEATURES_PILLS = [
  { icon: CalendarCheck, label: 'Agenda & Calendario' },
  { icon: Users, label: 'Gestión de Pacientes' },
  { icon: Stethoscope, label: 'Historial Clínico' },
  { icon: Receipt, label: 'Presupuestos en PDF' },
  { icon: BarChart3, label: 'Finanzas & Reportes' },
  { icon: Bell, label: 'Notificaciones Auto.' },
  { icon: FileText, label: 'Documentos Clínicos' },
  { icon: Shield, label: 'Roles & Seguridad' },
  { icon: Building2, label: 'Multi-sede' },
  { icon: Mail, label: 'Emails Automáticos' },
];

const CALENDAR_APPOINTMENTS = [
  { hora: '09:00', paciente: 'Ana Martínez', tratamiento: 'Ortodoncia', doctor: 'Dr. López', color: 'bg-blue-500', paid: true },
  { hora: '10:30', paciente: 'Carlos Ruiz', tratamiento: 'Blanqueamiento', doctor: 'Dra. García', color: 'bg-emerald-500', paid: false },
  { hora: '12:00', paciente: 'Laura Sosa', tratamiento: 'Implante', doctor: 'Dr. López', color: 'bg-violet-500', paid: true },
  { hora: '15:00', paciente: 'Jorge Díaz', tratamiento: 'Limpieza', doctor: 'Dra. García', color: 'bg-orange-500', paid: false },
];

const NOTIFICACIONES = [
  { icon: Mail, text: 'Email enviado — Ana Martínez', sub: 'Turno confirmado para mañana 9:00 hs', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: FaWhatsapp, text: 'WhatsApp enviado — Carlos Ruiz', sub: 'Recordatorio: tu turno es en 2 horas', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: CheckCircle2, text: 'Pago registrado — $8.500', sub: 'Laura Sosa · Implante · Cobrado', color: 'text-violet-600', bg: 'bg-violet-50' },
];

export default function FeatureSection() {
  const [activeNotif, setActiveNotif] = useState(0);
  const [activeAppt, setActiveAppt] = useState(0);
  const waHref = WhatsappHref({ message: 'Hola, quiero empezar con DentalCor gratis. ¿Me podés ayudar?' });

  useEffect(() => {
    const t = setInterval(() => setActiveNotif(p => (p + 1) % NOTIFICACIONES.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveAppt(p => (p + 1) % CALENDAR_APPOINTMENTS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30 relative overflow-hidden">

      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-cyan-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="space-y-8">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full shadow-md border border-blue-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-slate-800">🇦🇷 Software 100% argentino para clínicas dentales</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.08] mb-5">
                Organizá tu clínica.
                <br />
                <span className="bg-gradient-to-r from-[#008DD2] via-cyan-500 to-[#008DD2] bg-clip-text text-transparent">
                  Hacela crecer.
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
                Agenda inteligente, historial clínico digital, presupuestos en PDF,
                finanzas en tiempo real y notificaciones automáticas.
                <strong className="text-slate-800"> Todo en un solo sistema.</strong>
              </p>
            </div>

            {/* Outcomes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OUTCOMES.map((o) => (
                <div key={o.titulo} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className={`w-9 h-9 ${o.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <o.icon className={`w-4 h-4 ${o.color}`} />
                  </div>
                  <p className="text-sm font-black text-slate-900 mb-1">{o.titulo}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{o.desc}</p>
                </div>
              ))}
            </div>

            {/* Feature pills */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Incluye todo esto:</p>
              <div className="flex flex-wrap gap-2">
                {FEATURES_PILLS.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-[#008DD2]/40 hover:text-[#008DD2] transition-colors"
                  >
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Oferta */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#008DD2] to-cyan-500 rounded-2xl blur opacity-40" />
              <div className="relative bg-gradient-to-r from-[#008DD2] to-[#0070a8] rounded-2xl px-6 py-5 text-white flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-yellow-300" />
                    <span className="font-black text-lg">Primer mes GRATIS</span>
                    <span className="bg-yellow-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full animate-bounce">🔥 OFERTA</span>
                  </div>
                  <p className="text-white/80 text-sm">Sin contrato · Sin tarjeta de crédito · Setup incluido</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-white/40 flex-shrink-0" />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl hover:shadow-emerald-500/40 transition-all"
              >
                <FaWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Empezar gratis ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#como-te-ven"
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-7 py-4 rounded-2xl font-bold text-base shadow-md border border-slate-200 transition-all"
              >
                Ver todas las funciones
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </a>
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {[
                { icon: Shield, label: 'SSL Seguro', color: 'text-emerald-600' },
                { icon: Clock, label: 'Soporte 24/7', color: 'text-blue-600' },
                { icon: Cloud, label: '100% Cloud', color: 'text-violet-600' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs font-bold text-slate-700">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 ml-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs font-bold text-slate-600 ml-1">4.9 — +500 clínicas</span>
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: Dashboard mockup ── */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-[#008DD2]/20 to-cyan-400/20 rounded-3xl blur-3xl" />

            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">

              {/* Header del panel */}
              <div className="bg-gradient-to-r from-[#008DD2] to-[#0070a8] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white text-lg">🦷</div>
                  <div>
                    <p className="font-black text-white text-sm">DentalCor — Panel Admin</p>
                    <p className="text-white/60 text-xs">Consultorio García · Hoy</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                </div>
              </div>

              <div className="p-5 space-y-4">

                {/* Stats rápidas */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Turnos hoy', value: '12', icon: CalendarCheck, color: 'text-[#008DD2]', bg: 'bg-blue-50' },
                    { label: 'Pacientes', value: '347', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Este mes', value: '$482K', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-3.5 text-center`}>
                      <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                      <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Mini calendario del día */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-[#008DD2]" />
                      <span className="text-xs font-black text-slate-800">Agenda de hoy</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {CALENDAR_APPOINTMENTS.map((appt, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-500 ${
                          i === activeAppt
                            ? 'bg-white border-[#008DD2]/30 shadow-sm scale-[1.01]'
                            : 'bg-white/50 border-transparent'
                        }`}
                      >
                        <div className={`w-1.5 h-10 ${appt.color} rounded-full flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 truncate">{appt.paciente}</span>
                            <span className="text-[10px] text-slate-400 ml-2 flex-shrink-0">{appt.hora}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">{appt.tratamiento} · {appt.doctor}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${
                              appt.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {appt.paid ? 'Cobrado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notificaciones automáticas */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-4 h-4 text-pink-500 animate-pulse" />
                    <span className="text-xs font-black text-slate-800">Notificaciones automáticas</span>
                  </div>
                  <div className="space-y-2">
                    {NOTIFICACIONES.map((n, i) => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-500 ${
                            i === activeNotif
                              ? `${n.bg} border border-current/10 shadow-sm scale-[1.01]`
                              : 'bg-white border border-slate-100'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${n.color} flex-shrink-0 mt-0.5`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 leading-tight">{n.text}</p>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{n.sub}</p>
                          </div>
                          {i === activeNotif && (
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Finanzas rápidas */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-slate-800">Resumen financiero</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">Este mes</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">Ingresos cobrados</span>
                      <span className="text-sm font-black text-emerald-600">$362.000</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Cobrado: 75%</span>
                      <span className="text-orange-600 font-bold">Pendiente: $120.000</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
