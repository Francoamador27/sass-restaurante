import Contacto from "../components/Contacto";
import FeatureSection from "../components/FeatureSection";
import ServiciosFront from "../components/ServiciosFront";
import ComoComprar from "../components/Items";
import useCont from "../hooks/useCont";
import Testimonials from "./Testimonials";
import Test from "../components/test/Test";
import Mapa from "../components/Mapa/Mapa";
import SEOHead from "../components/Head/Head";
import GTMBody from "../components/BodyVerification/GTMBody";
import Beneficios from "../components/Beneficios";
import Comparacion from "../components/Comparacion";
import Cta from "../components/Cta";
import FuncionalidadesSaaS from "../components/FuncionalidadesSaaS";
const Inicio = () => {
  const { auth, company } = useCont();
  return (
    <>
      <div className="  ">
        <FeatureSection />
        <FuncionalidadesSaaS />
        <ComoComprar />
        <ServiciosFront />
        <Cta />
        <Beneficios />
        <Comparacion />
        <div></div>
        {/* <Testimonials /> */}
        <Contacto />
        <SEOHead
          priority="high" // ← ESTO ES LO IMPORTANTE
          title={`${company.name} | El mejor software odontológico para tu clínica`}
        />
      </div>
    </>
  );
};

export default Inicio;
