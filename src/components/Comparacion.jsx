import { CheckCircle2, Sparkles } from 'lucide-react';
import React from 'react';

const Comparacion = () => {
    return (
        <div>
            
      {/* Sección de comparación: Antes vs Después */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4">
            Antes y después de DentalCor
          </h2>
          <p className="text-xl text-slate-600">
            Mira cómo cambia tu día a día
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Antes */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">😰</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Sin DentalCor</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Llamadas telefónicas constantes para confirmar turnos',
                'Papeles y carpetas desorganizadas',
                'Pacientes que faltan sin avisar',
                'Horas perdidas en tareas administrativas',
                'Sin control de finanzas en tiempo real',
                'Archivos médicos extraviados',
                'Imposible saber el estado real de tu clínica'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✕</span>
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Después */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Con DentalCor</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Notificaciones  por WhatsApp y Email',
                'Todo digitalizado y accesible en segundos',
                'Recordatorios automáticos = menos ausencias',
                'Ahorra hasta 15 horas semanales',
                'Dashboard financiero en tiempo real',
                'Archivos organizados por paciente',
                'Reportes y estadísticas al instante'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

        </div>
    );
}

export default Comparacion;
