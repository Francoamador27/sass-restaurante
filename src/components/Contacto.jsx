import { useRef, useState } from "react";
import TurnstileCaptcha from "../components/TurnstileCaptcha";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";
import WhatsappHref from "../utils/WhatsappUrl";
import useCont from "../hooks/useCont";
import SEOHead from "./Head/Head";

const Contacto = () => {
  const formRef = useRef(null);
  const turnstileRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [estadoMensaje, setEstadoMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const { company, contact } = useCont();

  const isLocal = import.meta.env.VITE_ENTORNO === "local";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstadoMensaje({ tipo: "", texto: "" });

    try {
      const fd = new FormData(formRef.current);
      const datos = {
        nombre: fd.get("nombre")?.toString().trim() || "",
        email: fd.get("email")?.toString().trim() || "",
        telefono: fd.get("telefono")?.toString().trim() || "",
        mensaje: fd.get("mensaje")?.toString().trim() || "",
        turnstile_token: isLocal ? "local-bypass" : captchaToken,
      };

      const res = await clienteAxios.post("/api/contacto", datos);
      const isOk =
        (res.status >= 200 && res.status < 300) || res.data?.success === true;

      if (!isOk) throw new Error(res.data?.message || "Error al enviar");

      setEstadoMensaje({
        tipo: "exito",
        texto:
          res.data?.message ||
          "Mensaje enviado correctamente. Te contactaremos pronto.",
      });

      formRef.current?.reset();
      setCaptchaToken("");
      if (!isLocal && turnstileRef.current?.reset) {
        turnstileRef.current.reset();
      }
    } catch (error) {
      console.error("Contacto error:", error);
      setEstadoMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          error.message ||
          "Hubo un error al enviar el mensaje",
      });
      if (!isLocal && turnstileRef.current?.reset) {
        turnstileRef.current.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20 overflow-hidden">
      <SEOHead
        priority="low"
        title={`${company.name} | Contacto`}
        description={`Contactá con ${company.name}, especialistas en desarrollo de software odontológico. Te ayudamos a digitalizar tu clínica o crear tu propio sistema.`}
      />

      {/* Glow decorativo */}
      <div className="absolute -top-32 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Encabezado */}
        <header className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            🚀 Desarrollos Digitales
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-3">
            Contactanos
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Dejanos tu mensaje o escribinos directamente por{" "}
            <a
              href={WhatsappHref({
                message: "Hola, quiero saber más sobre su software odontológico",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#008DD2] underline font-semibold hover:text-[#0079AF]"
            >
              WhatsApp
            </a>
            . Te asesoramos sin compromiso.
          </p>
        </header>

        {/* Card de contacto */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 relative overflow-hidden">
          {/* Brillo decorativo */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2] transition"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2] transition"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tu mensaje
              </label>
              <textarea
                name="mensaje"
                rows="5"
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#008DD2]/30 focus:border-[#008DD2] transition resize-none"
                placeholder="Contanos qué necesitás..."
              />
            </div>

            {!isLocal && (
              <div>
                <TurnstileCaptcha ref={turnstileRef} onVerify={setCaptchaToken} />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#008DD2] to-[#00AEEF] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-[#008DD2]/30 hover:scale-[1.02] transition-all disabled:opacity-60"
                disabled={loading || (!isLocal && !captchaToken)}
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
              <a
                href={WhatsappHref({
                  message: "Hola, quiero información sobre su software",
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white text-[#008DD2] ring-1 ring-[#008DD2]/30 font-semibold px-6 py-3 rounded-lg hover:bg-[#F5FBFE] transition shadow-sm text-center"
              >
                💬 Escribir por WhatsApp
              </a>
            </div>

            {estadoMensaje.texto && (
              <div className="mt-4">
                <Alerta tipo={estadoMensaje.tipo}>{estadoMensaje.texto}</Alerta>
              </div>
            )}
          </form>

          {/* Footer de info */}
          <div className="mt-10 border-t border-slate-100 pt-6 text-center text-slate-500 text-sm">
            <p>
              📍 {company.address || "Córdoba, Argentina"} | ✉️{" "}
              {contact.email || "info@dentalcor.com"} | ☎️{" "}
              {contact.phone || "+54 9 351 7699950"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
