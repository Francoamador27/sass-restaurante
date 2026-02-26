import { PhoneIcon, CodeBracketSquareIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import WhatsappHref from '../utils/WhatsappUrl';
import Mapa from './Mapa/Mapa';
import useCont from '../hooks/useCont';
import SEOHead from './Head/Head';

const QuienesSomos = () => {
  const { company, logoUrl, contact } = useCont();

  // JSON-LD optimizado para empresa de software
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": company?.name || "DentalCor Software",
    "url": window?.location?.origin || "",
    "logo": logoUrl || `${window?.location?.origin || ''}/og-dentalcor.jpg`,
    "description": "Desarrollo de software odontológico y soluciones digitales para clínicas y consultorios. DentalCor: tecnología para optimizar la gestión odontológica.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contact?.phone || "+54 9 351 7699950",
      "contactType": "Atención al cliente",
      "areaServed": "AR",
      "availableLanguage": ["Español"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": company?.address || "Córdoba Capital",
      "addressCountry": "AR"
    },
    "sameAs": [
      "https://www.linkedin.com/company/dentalcor",
      "https://www.instagram.com/dentalcor"
    ]
  };

  return (
    <section className="relative">
      <SEOHead
        title={`${company.name} | Desarrollo de Software Odontológico`}
        description={`En ${company.name} desarrollamos software a medida para clínicas odontológicas y profesionales de la salud. Optimizá tu gestión con DentalCor.`}
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-[#F5FBFE]" />

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <header className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#008DD2] font-medium tracking-wide bg-[#EAF7FD] px-3 py-1 rounded-full">
            {company.name || "DentalCor Software"}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Desarrollamos <span className="text-[#008DD2]">software que impulsa tu clínica</span>
          </h1>
          <p className="mt-4 text-slate-600 text-lg max-w-3xl mx-auto">
            Somos un equipo de desarrolladores apasionados por la innovación tecnológica aplicada a la salud. 
            Creamos soluciones digitales que transforman la gestión de clínicas y consultorios odontológicos.
          </p>
        </header>

        {/* Grid principal */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Columna texto */}
          <div className="md:col-span-3">
            <section className="bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Nuestra misión</h2>
              <p className="mt-3 text-slate-600">
                Desarrollar software intuitivo, escalable y seguro para que los profesionales de la salud puedan concentrarse en lo importante: 
                brindar un mejor servicio a sus pacientes. 
                Nuestro producto estrella, <strong>DentalCor</strong>, automatiza turnos, historiales, notificaciones y finanzas en una sola plataforma.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-100 p-4 bg-white">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CodeBracketSquareIcon className="w-5 h-5 text-[#008DD2]" />
                    Nuestros servicios
                  </h3>
                  <ul className="mt-2 text-slate-600 space-y-1 list-disc list-inside">
                    <li>Desarrollo de software a medida</li>
                    <li>Aplicaciones web y móviles</li>
                    <li>Integraciones con sistemas médicos</li>
                    <li>Infraestructura en la nube (Cloud SaaS)</li>
                    <li>Soporte y mantenimiento continuo</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-100 p-4 bg-white">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-[#008DD2]" />
                    Por qué elegirnos
                  </h3>
                  <ul className="mt-2 text-slate-600 space-y-1 list-disc list-inside">
                    <li>Soluciones específicas para odontología</li>
                    <li>Equipo técnico y soporte local</li>
                    <li>Actualizaciones constantes</li>
                    <li>Seguridad y respaldo de datos</li>
                    <li>Experiencia en proyectos de salud</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={WhatsappHref({ message: "Hola, quiero conocer más sobre su software odontológico" })}
                  className="bg-white/95 hover:bg-white text-[#008DD2] ring-1 ring-[#008DD2]/20 px-6 py-3 rounded-md font-semibold shadow-sm transition"
                  target="_blank"
                >
                  💬 Consultar por DentalCor
                </a>

                <a
                  href={`tel:${contact.phone || ''}`}
                  className="bg-white/80 hover:bg-white text-slate-800 ring-1 ring-slate-200 px-6 py-3 rounded-md font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <PhoneIcon className="h-5 w-5" />
                  Llamar
                </a>

                <Link
                  to="/contacto"
                  className="bg-transparent hover:bg-white/70 text-slate-800 ring-1 ring-white/60 backdrop-blur px-6 py-3 rounded-md font-semibold shadow-sm transition"
                >
                  📍 Contacto
                </Link>
              </div>
            </section>
          </div>

          {/* Columna lateral */}
          <aside className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white/90 backdrop-blur shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900">Datos de la empresa</h3>
              <div className="mt-4 space-y-3 text-slate-700">
                <p>
                  <span className="block text-slate-500 text-sm">Dirección</span>
                  <strong>{company.address || "Córdoba, Argentina"}</strong>
                </p>
                <p>
                  <span className="block text-slate-500 text-sm">Horario</span>
                  <strong>{company.business_hours || "Lunes a Viernes, 9 a 18hs"}</strong>
                </p>
                <div>
                  <span className="block text-slate-500 text-sm">Contacto</span>
                  <div className="flex flex-col gap-1">
                    <span>
                      WhatsApp:{" "}
                      <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        Iniciar chat
                      </a>
                    </span>
                    <span>
                      Email:{" "}
                      <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer">
                        {contact.email || "info@dentalcor.com"}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-slate-100">
                <Mapa />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/90 backdrop-blur shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900">Compromiso con la innovación</h3>
              <p className="mt-2 text-slate-600">
                Apostamos al desarrollo tecnológico nacional. Nuestro equipo combina <strong>experiencia técnica</strong> con un profundo conocimiento de los procesos clínicos para ofrecer soluciones reales que mejoran la productividad.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Software a medida</li>
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Cloud & Seguridad</li>
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Automatización</li>
                <li className="rounded-lg bg-[#EAF7FD] text-[#005e88] px-3 py-2">Soporte local</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-slate-800 font-medium">
              ¿Querés desarrollar tu propio software o mejorar la gestión de tu clínica?
            </span>
            <Link
              to="/contacto"
              className="inline-flex items-center rounded-lg bg-[#008DD2] text-white px-5 py-2.5 font-semibold shadow-sm hover:bg-[#0079AF] transition"
            >
              Hablemos
            </Link>
          </div>
        </div>
      </div>

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};

export default QuienesSomos;
