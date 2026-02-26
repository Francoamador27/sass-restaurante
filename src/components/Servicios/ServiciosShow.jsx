import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import SEOHead from "../Head/Head";

const ACCENT = "#0099cc";
const isImageUrl = (url = "") =>
  /\.(jpe?g|png|webp|gif|bmp|svg)(\?.*)?$/i.test(url || "");

export default function ServiciosShow() {
  const { slug, idOrSlug, id } = useParams();
  const param = slug || idOrSlug || id;

  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const token = localStorage.getItem("AUTH_TOKEN");

  useEffect(() => {
    const fetchServicio = async () => {
      if (!param) return;
      setLoading(true);
      setErr(null);
      try {
        const { data } = await clienteAxios.get(`/api/servicios/${encodeURIComponent(param)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setServicio(data?.data ?? data ?? null);
      } catch (e) {
        console.error("Error cargando servicio:", e);
        setErr("No se pudo cargar el servicio.");
      } finally {
        setLoading(false);
      }
    };
    fetchServicio();
  }, [param, token]);

  const tags = useMemo(() => {
    const t = servicio?.tags;
    if (Array.isArray(t)) return t;
    if (typeof t === "string") return t.split(",").map((x) => x.trim()).filter(Boolean);
    return [];
  }, [servicio]);

  const features = useMemo(() => {
    const f = servicio?.features;
    if (Array.isArray(f)) return f;
    if (typeof f === "string") {
      try {
        const parsed = JSON.parse(f);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [servicio]);

  const gallery = useMemo(() => {
    if (!servicio) return [];

    const mainImg = servicio.mainImage_url || servicio.image_url || null;
    const galleryImgs = Array.isArray(servicio.gallery_urls)
      ? servicio.gallery_urls
      : [];

    let merged = [];

    // 1️⃣ Si hay imagen principal → la ponemos primera
    if (mainImg) {
      merged.push(mainImg);
    }

    // 2️⃣ Agregamos el resto evitando duplicados
    galleryImgs.forEach((img) => {
      if (img !== mainImg) merged.push(img);
    });

    return merged;
  }, [servicio]);


  const descripcion =
    servicio?.description ?? servicio?.descripcion ?? "Sin descripción disponible";

  // 📹 Video del módulo (si el backend lo provee)
  const rawVideo = servicio?.video || null;

  // Si viene una URL normal de YouTube, la convertimos a embed
  let videoUrl = null;

  if (rawVideo) {
    const yid = rawVideo.match(
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    );
    if (yid && yid[7]?.length === 11) {
      videoUrl = `https://www.youtube.com/embed/${yid[7]}`;
    }
  }

  // SEO schema enriquecido
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: servicio?.title || "Módulo DentalCor",
    applicationCategory: "MedicalSoftware",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: features.map((f) => (typeof f === "string" ? f : f.title)),
    description: descripcion,
    image: gallery?.[0],
    video: videoUrl,
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 overflow-hidden">
      <SEOHead
        priority="high"
        title={`${servicio?.title || "Módulo"} | DentalCor Software Odontológico`}
        description={`Explorá el módulo ${servicio?.title || ""} del sistema DentalCor: software odontológico de gestión moderna.`}
        keywords={`software odontológico, dentalcor, ${servicio?.title}, clínica dental, odontología digital`}
      />

      {/* Fondo 3D */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-cyan-300/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-gradient-to-tr from-emerald-300/20 to-blue-300/10 blur-3xl rounded-full"></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <nav className="text-sm text-slate-600 mb-4 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition">Inicio</Link> /
          <Link to="/servicios" className="hover:text-blue-600 transition"> Módulos</Link>
          {servicio?.title && <span className="text-slate-800 font-semibold"> / {servicio.title}</span>}
        </nav>

        <h1 className="text-4xl px-8 md:text-5xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 drop-shadow-sm mb-8">
          {servicio?.title || (loading ? "Cargando..." : "No encontrado")}
        </h1>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 mb-10 text-red-700 font-medium">
            {err}
          </div>
        )}
      </div>

      {/* 🖼️ Galería Swiper */}
      {!loading && servicio && gallery.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mb-14">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Descripción</h2>
            <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line mb-4">
              {descripcion}
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full text-sm shadow-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Galería</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            spaceBetween={16}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
            }}
          >
            {gallery.map((url, i) => (
              <SwiperSlide key={i}>
                <div
                  className="relative rounded-2xl overflow-hidden bg-white/70 border border-slate-100 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setActiveIndex(i);
                    setLightboxOpen(true);
                  }}
                >
                  {isImageUrl(url) ? (
                    <img
                      src={url}
                      alt={`Imagen ${i + 1}`}
                      className="object-cover w-full h-[230px] hover:brightness-110 transition-all duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-[230px] items-center justify-center text-blue-600 text-sm">
                      Ver recurso
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Lightbox */}
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={activeIndex}
            slides={gallery.map((url) => ({ src: url }))}
          />
        </div>
      )}

      {/* 🧾 Descripción + Video */}
      {!loading && servicio && (
        <div className="max-w-6xl mx-auto px-6 pb-20">


          {/*  Features */}
          {features.length > 0 && (
            <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl border border-slate-200 shadow-xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-blue-700 mb-6">Características principales</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((f, i) => {
                  const title = typeof f === "string" ? f : f?.title;
                  const desc = typeof f === "string" ? "" : f?.description;
                  return (
                    <div
                      key={i}
                      className="group p-6 rounded-2xl bg-white/80 border border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 mt-2 shadow-inner" />
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {title}
                          </h4>
                          {desc && <p className="text-slate-600 mt-1">{desc}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {videoUrl && (
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <iframe
                src={videoUrl}
                title="Video explicativo"
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          )}
          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl hover:scale-105 hover:shadow-blue-500/40 transition-all"
            >
              🚀 Solicitar demo del sistema
            </Link>
          </div>
        </div>
      )}

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema, null, 2) }}
      />
    </section>
  );
}
