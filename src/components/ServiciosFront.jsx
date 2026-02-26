import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WhatsappHref from '../utils/WhatsappUrl';
import useSWR from 'swr';
import clienteAxios from '../config/axios';
import SEOHead from './Head/Head';
import useCont from '../hooks/useCont';

export default function ServiciosFront() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [serviciosApi, setServiciosApi] = useState([]);

  // ---- SWR (API dinámica) ----
  const fetcher = (url) => clienteAxios(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR('/api/servicios', fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!data) return;
    const items = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    setServiciosApi(items);
  }, [data]);

  // ---- Animación al entrar ----
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) =>
              new Set(prev).add(entry.target.dataset.index)
            );
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    const cards = document.querySelectorAll('[data-index]');
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [serviciosApi]);

  // ---- Fallback si la API no trae nada ----
  const serviciosFallback = [
    {
      icon: '🧠',
      titulo: 'Gestión Integral del Consultorio',
      descripcion:
        'Administra turnos, pacientes, tratamientos, finanzas y personal desde un solo lugar. DentalCor centraliza toda la información de tu clínica.',
      highlight: 'Todo en un solo sistema',
    },
    {
      icon: '📅',
      titulo: 'Agenda Inteligente de Turnos',
      descripcion:
        'Organiza turnos por profesional, sala o especialidad. Notificaciones automáticas por WhatsApp y recordatorios a tus pacientes.',
      highlight: 'Ahorra tiempo',
    },
    {
      icon: '💳',
      titulo: 'Módulo Financiero',
      descripcion:
        'Control de facturación, presupuestos, pagos, deudas y reportes automáticos. Mantén el control de tu clínica en tiempo real.',
      highlight: 'Finanzas claras',
    },
    {
      icon: '📊',
      titulo: 'Panel de Estadísticas',
      descripcion:
        'Visualiza métricas clave: ingresos, pacientes activos, tratamientos realizados, conversión y más. Decisiones basadas en datos.',
      highlight: 'Análisis en tiempo real',
    },
    {
      icon: '📂',
      titulo: 'Historias Clínicas Digitales',
      descripcion:
        'Registra evolución, diagnósticos, odontogramas y archivos por paciente. Acceso rápido y seguro desde cualquier dispositivo.',
      highlight: 'Todo digitalizado',
    },
    {
      icon: '👥',
      titulo: 'Portal para Pacientes',
      descripcion:
        'Tus pacientes pueden ver sus turnos, historial y estudios desde una plataforma segura. Mejora la comunicación y fidelización.',
      highlight: 'Mejor experiencia',
    },
    {
      icon: '🔒',
      titulo: 'Seguridad y Respaldo',
      descripcion:
        'Tu información y la de tus pacientes está protegida con encriptación SSL y backups automáticos en la nube.',
      highlight: 'Protección total',
    },
    {
      icon: '🚀',
      titulo: 'Soporte y Capacitación',
      descripcion:
        'Te acompañamos en cada paso con soporte técnico local y capacitaciones personalizadas para tu equipo.',
      highlight: 'Acompañamiento 24/7',
    },
  ];

  // Si la API trae datos, los usamos; si no, fallback
  const servicios = (serviciosApi?.length ? serviciosApi : serviciosFallback).map(
    (s) => ({
      icon: s.icon ?? '💻',
      titulo: s.titulo ?? s.title ?? 'Módulo del sistema',
      descripcion: s.descripcion ?? s.description ?? '',
      highlight: s.highlight ?? s.tagline ?? '',
      slug: s.slug ?? s.titulo?.toLowerCase().replace(/\s+/g, '-'),
      image: s.image ?? null,
    })
  );

  const { company } = useCont();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 px-6 lg:px-20 overflow-hidden">
      <SEOHead
        priority="low"
        title={`${company.name} | Módulos y funcionalidades del software odontológico`}
        description={`Conocé las herramientas que ofrece ${company.name}: gestión integral, historias clínicas digitales, agenda inteligente y panel financiero. Potenciá tu clínica con tecnología.`}
      />

      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 font-medium text-sm mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Software Odontológico en la Nube
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Funcionalidades Principales
            <span className="block text-blue-600 text-2xl lg:text-3xl font-light mt-2">
              Todo lo que tu clínica necesita
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            DentalCor reúne en un solo sistema todo lo necesario para administrar tu clínica de
            forma ágil, segura y profesional. Desde la agenda hasta las finanzas, todo conectado.
          </p>
          <div className="mt-6 h-1 w-32 rounded-full mx-auto bg-gradient-to-r from-blue-600 to-cyan-400"></div>
        </div>

        {/* Carga o error */}
        {isLoading && (
          <div className="text-center text-slate-500 mb-8">
            Cargando módulos del sistema…
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 mb-8">
            No se pudieron cargar los módulos.
          </div>
        )}

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {servicios.map((item, idx) => (
            <div
              key={idx}
              data-index={idx}
              className={`group relative bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 
        hover:bg-white hover:shadow-2xl hover:border-blue-200/40 
        transform transition-all duration-500 hover:-translate-y-2
        ${visibleCards.has(String(idx))
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* 🔗 Link invisible pero clickeable en toda la card */}
              <Link
                to={`/servicios/${item.slug}`}
                className="absolute inset-0 rounded-2xl z-20 pointer-events-auto"
                aria-label={`Ver detalles de ${item.titulo}`}
              />

              {/* Fondo de hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              {/* Contenido visual */}
              <div className="relative z-10 pointer-events-none">
                {/* Badge */}
                {item.highlight && (
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 pointer-events-none">
                    {item.highlight}
                  </div>
                )}

                {/* Icono o imagen */}
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors duration-300 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.titulo}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                  )}
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {item.titulo}
                </h3>

                {/* Descripción */}
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.descripcion}
                </p>

                {/* Indicador visual */}
                <div className="flex items-center text-blue-600 text-sm font-medium opacity-90 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  Ver detalles
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* CTA Final */}
        <div className="text-center">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a
              href={WhatsappHref({
                message: 'Hola, quiero una demo del sistema DentalCor',
              })}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-blue-500/30 transition-all"
              target="_blank"
              rel="noreferrer"
            >
              🚀 Solicitar demo gratis
            </a>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            <p>
              🌐 <strong>Software en la nube</strong> | 🏥{' '}
              <strong>+500 clínicas conectadas</strong> | 🛡️{' '}
              <strong>Datos 100% seguros</strong>
            </p>
          </div>
        </div>

        {/* Schema SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "DentalCor",
              operatingSystem: "Web, Cloud",
              applicationCategory: "HealthApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: servicios.map((s) => s.titulo),
              description:
                "Software odontológico integral para la gestión de clínicas y consultorios. Agenda, pacientes, finanzas y reportes en una sola plataforma.",
            }),
          }}
        />
      </div>
    </section>
  );
}
