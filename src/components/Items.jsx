export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="bg-white">
      {/* Encabezado */}
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold" style={{ color: '#008DD2' }}>
          ¿Quiénes Somos?
        </h2>
        <div
          className="mt-2 h-1 w-20 mx-auto rounded-full"
          style={{ backgroundColor: '#008DD2' }}
        />
      </div>

      {/* 2 columnas */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Izquierda: Video institucional + texto SEO */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-gray-50 aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/SGRWxeaIbPw?rel=0&modestbranding=1&autoplay=0&controls=1&showinfo=0"
              title="Video institucional DentalCor"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Texto SEO dentro de la misma columna */}
          <div className="text-gray-600 leading-relaxed bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm">


            <p className="mb-2">
              Con una interfaz intuitiva y herramientas automatizadas, ayudamos a los profesionales
              de la salud a mejorar su productividad y la experiencia de sus pacientes.
            </p>
            <p>
              DentalCor combina innovación, seguridad y soporte local para impulsar la
              <strong> transformación digital del sector odontológico</strong>.
            </p>
          </div>
        </div>

        {/* Derecha: Descripción */}
        <aside className="md:pl-6">
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <span
                className="inline-block h-2 w-16 rounded-full"
                style={{ backgroundColor: '#008DD2' }}
              />
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              DentalCor Software
            </h3>

            <p className="text-gray-600 leading-relaxed mb-4">
              Somos una empresa dedicada al desarrollo de software para el sector odontológico y de salud.
              Creamos soluciones digitales que ayudan a clínicas y consultorios a optimizar su gestión, 
              mejorar la comunicación con pacientes y aumentar su rentabilidad.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Desde Argentina, desarrollamos tecnología en la nube con enfoque en seguridad, usabilidad 
              y personalización. Nuestro objetivo es acompañar a los profesionales de la salud 
              en su transformación digital.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: '#008DD2' }} />
                <span className="text-gray-700">Desarrollo a medida</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: '#008DD2' }} />
                <span className="text-gray-700">Soporte técnico local</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: '#008DD2' }} />
                <span className="text-gray-700">Seguridad en la nube</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: '#008DD2' }} />
                <span className="text-gray-700">Automatización inteligente</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
