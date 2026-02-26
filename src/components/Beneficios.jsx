import React from 'react';
import { CalendarCheck, Users, TrendingUp, MessageSquare, Clock, Shield, Zap, BarChart3, CheckCircle2, ArrowRight, Play, Star, Award, Sparkles, Rocket, DollarSign, FileText, Bell, Lock, Cloud, FolderOpen, UserCog, CreditCard, Mail, Send } from 'lucide-react';

const benefits = [
  '⏱️ Ahorra hasta 15 horas semanales en gestión administrativa',
  '💰 Aumenta la facturación promedio en un 30%',
  '📱 Notificaciones automáticas por Email y WhatsApp',
  '📁 Historial clínico completo con gestión de archivos',
  '👥 Accesos personalizados para pacientes y staff',
  '💳 Control financiero total de tu clínica',
  '🌐 Acceso desde cualquier dispositivo, en cualquier lugar',
  '🛡️ Soporte técnico en español 24/7'
];
const testimonials = [
  {
    name: "Dra. María González",
    role: "Odontóloga - Buenos Aires",
    content: "Las notificaciones  cambiaron todo. Ya no pierdo tiempo llamando para confirmar turnos y mis pacientes llegan puntuales.",
    rating: 5,
    image: "MG"
  },
  {
    name: "Dr. Carlos Mendoza",
    role: "Director - Clínica Dental Sonrisas",
    content: "El panel financiero es increíble. Veo en tiempo real cuánto facturo, qué debo y puedo tomar decisiones con datos reales.",
    rating: 5,
    image: "CM"
  }
];
const Beneficios = () => {
    return (
        <div>
            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-bold text-white">Beneficios Comprobados</span>
                            </div>
                            <h2 className="text-5xl font-black text-white mb-6">
                                ¿Por qué elegir DentalCor?
                            </h2>
                            <p className="text-slate-300 text-xl mb-8 leading-relaxed">
                                Más de 500 consultorios en Argentina confían en nuestra plataforma para
                                optimizar su gestión diaria y crecer profesionalmente.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white/5 backdrop-blur rounded-xl p-4 hover:bg-white/10 transition-all">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-200 text-lg">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {testimonials.map((testimonial, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-white text-lg mb-4 leading-relaxed font-medium">"{testimonial.content}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {testimonial.image}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{testimonial.name}</p>
                                            <p className="text-slate-300 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Card de confianza adicional */}
                            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-400/30">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-lg">Datos 100% Seguros</h4>
                                        <p className="text-emerald-200 text-sm">Encriptación SSL + Backup diario</p>
                                    </div>
                                </div>
                                <p className="text-white/90 leading-relaxed">
                                    Cumplimos con todas las normativas de protección de datos médicos. Tu información y la de tus pacientes está protegida con los más altos estándares de seguridad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Beneficios;
