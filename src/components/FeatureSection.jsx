import React, { useState, useEffect } from 'react';
import { CalendarCheck, Users, TrendingUp, MessageSquare, Clock, Shield, Zap, BarChart3, CheckCircle2, ArrowRight, Play, Star, Award, Sparkles, Rocket, DollarSign, FileText, Bell, Lock, Cloud, FolderOpen, UserCog, CreditCard, Mail, Send } from 'lucide-react';

const features = [
  {
    name: 'Calendario de Citas',
    description: 'Agenda visual con vista diaria, semanal y mensual. Gestiona turnos de múltiples profesionales simultáneamente.',
    icon: CalendarCheck,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Notificaciones ',
    description: 'Recordatorios por Email y WhatsApp que se envían automáticamente. Reduce ausencias hasta 70%.',
    icon: Bell,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Historial Clínico Digital',
    description: 'Odontogramas interactivos, evoluciones, diagnósticos y tratamientos. Todo el historial en un solo lugar.',
    icon: FileText,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Gestión de Archivos',
    description: 'Sube radiografías, estudios, consentimientos y documentos. Organizados por paciente con acceso instantáneo.',
    icon: FolderOpen,
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Panel Administrador',
    description: 'Control total de tu clínica. Gestiona usuarios, permisos, configuraciones y monitorea toda la actividad.',
    icon: UserCog,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Acceso para Pacientes',
    description: 'Portal exclusivo donde tus pacientes ven su historial, estudios, próximos turnos y pueden comunicarse.',
    icon: Users,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    name: 'Organización Financiera',
    description: 'Facturación, presupuestos, pagos, deudas y reportes contables. Control total de tus finanzas.',
    icon: CreditCard,
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Estadísticas en Tiempo Real',
    description: 'Dashboard con métricas clave: ingresos, tratamientos, pacientes activos, conversión y más.',
    icon: BarChart3,
    color: 'from-pink-500 to-rose-500'
  }
];

const stats = [
  { value: '98%', label: 'Satisfacción' },
  { value: '24/7', label: 'Soporte' },
  { value: '30%', label: 'Más ingresos' }
];



const dashboardFeatures = [
  { icon: CalendarCheck, label: 'Turnos hoy', count: '28', sublabel: 'Citas programadas' },
  { icon: Bell, label: 'Pacientes', count: '45', sublabel: 'Nuevos' },
  { icon: FileText, label: 'Historias', count: '1,234', sublabel: 'Pacientes activos' },
  { icon: CreditCard, label: 'Facturación', count: '$450K', sublabel: 'Este mes' }
];

const notificationTypes = [
  { icon: Mail, text: 'Email confirmación', time: 'Hace 5 min', color: 'blue' },
  { icon: Send, text: 'WhatsApp enviado', time: 'Hace 2 min', color: 'emerald' },
];

export default function DentalCorHero() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeNotification, setActiveNotification] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % dashboardFeatures.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotification((prev) => (prev + 1) % notificationTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 min-h-screen relative overflow-hidden">
      {/* Patrón de fondo dental - OPCIÓN 1: Dientes realistas */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundSize: '80px 100px',
        backgroundPosition: 'center'
      }}></div>

      {/* OPCIÓN 2: Patrón con logo DentalCor (descomenta para usar)
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url('/ruta-a-tu-logo.png')`,
        backgroundSize: '120px 120px',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat'
      }}></div>
      */}

      {/* OPCIÓN 3: Patrón de sonrisas (descomenta para usar)
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='60' viewBox='0 0 100 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 30 Q30 45 50 45 Q70 45 80 30' stroke='%230EA5E9' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='35' cy='25' r='2' fill='%230EA5E9'/%3E%3Ccircle cx='65' cy='25' r='2' fill='%230EA5E9'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 60px'
      }}></div>
      */}

      {/* Hero Principal */}
      <div className="relative overflow-hidden">
        {/* Decoraciones de fondo mejoradas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido Principal */}
            <div className="space-y-8 relative z-10">
              {/* Badge animado */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-blue-200/50 hover:scale-105 transition-transform">
                <div className="relative">
                  <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-400 blur-sm opacity-50"></div>
                </div>
                <span className="text-sm font-bold text-slate-800">🇦🇷 Software 100% Argentino</span>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>

              {/* Título impactante */}
              <div>
                <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                  <span className="block mb-2">Transformá</span>
                  <span className="block mb-2">tu clínica en una</span>
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent inline-block">
                    máquina de éxito
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-700 leading-relaxed font-medium">
              
                  <span className="block mt-2">Calendario, historias clínicas, notificaciones automáticas y finanzas en un solo lugar.</span>
                </p>
              </div>

              {/* Stats rápidas */}
              <div className="grid grid-cols-4 gap-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-slate-200/50 hover:scale-105 transition-transform">
                    <div className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Precio SUPER destacado con urgencia */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black animate-bounce">
                      🔥 OFERTA
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-bold bg-white/20 backdrop-blur rounded-lg px-3 py-2">
                      <Rocket className="w-5 h-5" />
                      <span>🎁 Primer mes GRATIS + Setup incluido</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sin contrato • Cancela cuando quieras</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Datos encriptados • Backup automático</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs potentes */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span className="relative">COMENZAR GRATIS AHORA</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <button 
                  onClick={() => setShowVideo(true)}
                  className="group bg-white hover:bg-slate-50 text-slate-800 px-8 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 border-2 border-slate-200"
                >
                  <Play className="w-6 h-6 text-blue-600" />
                  Ver Demo en Vivo
                </button>
              </div>

              {/* Trust indicators mejorados */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full shadow-md">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-800">SSL Seguro</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full shadow-md">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-slate-800">Soporte 24/7</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full shadow-md">
                  <Cloud className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-bold text-slate-800">100% Cloud</span>
                </div>
              </div>
            </div>

            {/* Dashboard Interactivo Mejorado - COLUMNA DERECHA */}
            <div className="relative lg:scale-110">
              {/* Glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"></div>
              
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-slate-200/50 backdrop-blur">
                {/* Header del dashboard */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">DentalCor</h3>
                      <p className="text-xs text-slate-500 font-semibold">Panel Administrador</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                  </div>
                </div>

                {/* Notificaciones en tiempo real */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 mb-5 border-2 border-emerald-200/50 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <h4 className="font-black text-sm text-slate-900">Notificaciones</h4>
                  </div>
                  <div className="space-y-2">
                    {notificationTypes.map((notif, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                          idx === activeNotification 
                            ? `bg-${notif.color}-500 text-white shadow-lg scale-105` 
                            : 'bg-white text-slate-700'
                        }`}
                      >
                        <notif.icon className={`w-4 h-4 ${idx === activeNotification ? 'animate-pulse' : ''}`} />
                        <div className="flex-1">
                          <p className="text-xs font-bold">{notif.text}</p>
                          <p className={`text-xs ${idx === activeNotification ? 'opacity-90' : 'text-slate-500'}`}>{notif.time}</p>
                        </div>
                        {idx === activeNotification && <Sparkles className="w-4 h-4 animate-spin" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tarjeta de paciente con acceso */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 mb-5 border border-blue-200/50 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg relative">
                      JP
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-black text-slate-900">Juan Pérez</h4>
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">Portal Activo</span>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CalendarCheck className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">Turno: Hoy 15:30hs</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FolderOpen className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold">3 archivos subidos</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-md">
                          Ver Historial
                        </button>
                        <button className="bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors border border-slate-200 shadow-md">
                          Archivos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid de métricas animadas */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {dashboardFeatures.map((feature, idx) => (
                    <div 
                      key={idx}
                      className={`bg-gradient-to-br ${
                        idx === activeFeature 
                          ? 'from-blue-600 to-cyan-600 shadow-xl scale-105' 
                          : 'from-slate-50 to-slate-100'
                      } rounded-2xl p-5 transition-all duration-500 border-2 ${
                        idx === activeFeature ? 'border-blue-400' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <feature.icon className={`w-6 h-6 ${idx === activeFeature ? 'text-white' : 'text-slate-600'}`} />
                        {idx === activeFeature && (
                          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                        )}
                      </div>
                      <div className={`text-3xl font-black mb-1 ${idx === activeFeature ? 'text-white' : 'text-slate-900'}`}>
                        {feature.count}
                      </div>
                      <div className={`text-xs font-bold ${idx === activeFeature ? 'text-blue-100' : 'text-slate-600'}`}>
                        {feature.label}
                      </div>
                      <div className={`text-xs ${idx === activeFeature ? 'text-blue-200' : 'text-slate-500'} mt-1`}>
                        {feature.sublabel}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Panel financiero */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <h4 className="font-black text-sm text-slate-900">Control Financiero</h4>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-semibold">Facturación mensual</span>
                      <span className="text-lg font-black text-green-600">$450.000</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full shadow-lg" style={{ width: '75%', animation: 'growWidth 2s ease-in-out' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-semibold">Cobrado: $337.5K</span>
                      <span className="text-orange-600 font-bold">Pendiente: $112.5K</span>
                    </div>
                  </div>
                </div>

                {/* Indicador de accesos */}
                <div className="mt-5 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/50">
                  <div className="flex items-center gap-3">
                    <UserCog className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs font-black text-slate-900">Usuarios Activos</p>
                      <p className="text-xs text-slate-600">3 profesionales • 234 pacientes</p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                      +231
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>







      {/* Video Modal */}
      {showVideo && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn"
          onClick={() => setShowVideo(false)}
        >
          <div className="bg-white rounded-3xl p-8 max-w-5xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900">Demo en Vivo de DentalCor</h3>
                <p className="text-slate-600 mt-1">Mira cómo funciona en menos de 3 minutos</p>
              </div>
              <button 
                onClick={() => setShowVideo(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-3 transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
              <div className="text-center">
                <Play className="w-20 h-20 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold text-lg">Video demo de DentalCor</p>
                <p className="text-slate-400 text-sm mt-2">Aquí iría tu video de demostración</p>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg">
                Comenzar prueba gratis ahora
              </button>
              <button className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes growWidth {
          from { width: 0%; }
          to { width: 75%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}