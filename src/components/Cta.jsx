import { ArrowRight, CalendarCheck, CheckCircle2, Rocket } from 'lucide-react';
import React from 'react';
import WhatsappHref from '../utils/WhatsappUrl';
import useCont from '../hooks/useCont';

const Cta = () => {
    const { company, contact } = useCont();
    return (
        <div>
            {/* Final CTA */}
            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-[2rem] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center shadow-2xl overflow-hidden">
                        {/* Decoraciones */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2 rounded-full mb-6">
                                <Rocket className="w-4 h-4 text-white" />
                                <span className="text-sm font-bold text-white">Oferta por Tiempo Limitado</span>
                            </div>

                            <h2 className="text-5xl font-black text-white mb-4">
                                Empezá a optimizar tu clínica hoy
                            </h2>
                            <p className="text-2xl text-blue-100 mb-8 max-w-2xl mx-auto font-medium">
                                Primer mes <span className="font-black">completamente gratis</span>. Sin tarjeta de crédito. Sin compromiso.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <button className="group bg-white hover:bg-slate-50 text-blue-600 px-12 py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-white/50 transition-all duration-200 flex items-center justify-center gap-3">
                                    <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    <a href={WhatsappHref({
                                        message: "Hola, quiero comenzar mi mes gratis de DentalCor",
                                    })} >
                                        Comenzar mi mes gratis
                                    </a>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>

                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-6 text-blue-100">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-semibold">Setup incluido</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-semibold">Capacitación gratis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-semibold">Sin contrato</span>
                                    </div>
                                </div>

                                <p className="text-blue-100 text-lg font-medium">
                                    ¿Preguntas? Contactanos por WhatsApp:{' '}
                                    <a href={WhatsappHref({
                                        message: "Hola, quiero saber más sobre su software odontológico",
                                    })} className="font-black text-white hover:text-yellow-300 transition-colors underline">
                                        {contact.phone}                  </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cta;
