import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Register from "./views/Register";
import AuthLayout from "./layout/AuthLayout";
import MyAccount from "./views/MyAccount";
import NotFound from "./components/NotFound";
import ResetPassword from "./views/ResetPassword";
import Contacto from "./components/Contacto";
import QuienesSomos from "./components/QuienesSomos";
import Precios from "./components/Precios";
import Ejemplos from "./components/Ejemplos";
import ServiciosFront from "./components/ServiciosFront";
import ServiciosShow from "./components/Servicios/ServiciosShow";

// Admin Dash
import AdminLayout from "./layout/AdminLayout";
import Calendario from "./views/Calendario/Calendario";
import Cita from "./views/Citas/Cita";
import CitasAdmin from "./views/Citas/CitasAdmin";
import DoctoresList from "./views/Usuarios/DoctoresList";
import Doctor from "./views/Usuarios/Doctor";
import PacientesList from "./views/Usuarios/Pacientes/PacientesList";
import Paciente from "./views/Usuarios/Pacientes/Paciente";
import HistorialPaciente from "./views/Usuarios/Pacientes/HistorialPaciente";
import Finanzas from "./components/Finanzas/Finanzas";
import MiClinica from "./views/AdminDash/MiClinica/MiClinica";
import Presupuestos from "./views/AdminDash/Presupuestos/Presupuestos";

// SuperAdmin Dash
import SuperAdminLayout from "./layout/SuperAdminLayout";
import SuperAdminDash from "./views/SuperAdmin/SuperAdminDash";
import TenantsList from "./views/SuperAdmin/Tenants/TenantsList";
import CreateAdminForTenant from "./views/SuperAdmin/Tenants/CreateAdminForTenant";
import SuperAdminTestimonios from "./views/SuperAdmin/Testimonios/SuperAdminTestimonios";
import SuperAdminEjemplos from "./views/SuperAdmin/Ejemplos/SuperAdminEjemplos";
import SuperAdminServicios from "./views/SuperAdmin/Servicios/SuperAdminServicios";
import EditServicios from "./components/Servicios/EditServicios";
import SuperAdminChatbot from "./views/SuperAdmin/Chatbot/SuperAdminChatbot";
import SuperAdminMailConfig from "./views/SuperAdmin/MailConfig/SuperAdminMailConfig";
import SuperAdminConfiguraciones from "./views/SuperAdmin/Configuraciones/SuperAdminConfiguraciones";
import UsuariosList from "./views/SuperAdmin/Usuarios/UsuariosList";
import TenantSelector from "./views/TenantSelector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "/servicios", element: <ServiciosFront /> },
      { path: "/servicios/:id", element: <ServiciosShow /> },
      { path: "/contacto", element: <Contacto /> },
      { path: "/quienes-somos", element: <QuienesSomos /> },
      { path: "/precios", element: <Precios /> },
      { path: "/ejemplos", element: <Ejemplos /> },
      { path: "auth/login", element: <Login /> },
      { path: "auth/reset-password", element: <ResetPassword /> },
      { path: "auth/register", element: <Register /> },
    ],
  },
  {
    path: "/select-tenant",
    element: <TenantSelector />,
  },
  {
    path: "/mi-cuenta",
    element: <AuthLayout />,
    children: [
      { index: true, element: <MyAccount /> },
    ],
  },
  {
    path: "/admin-dash",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Calendario /> },
      { path: "/admin-dash/citas", element: <CitasAdmin /> },
      { path: "/admin-dash/citas/:id", element: <Cita /> },
      { path: "/admin-dash/pacientes", element: <PacientesList /> },
      { path: "/admin-dash/pacientes/:id", element: <Paciente /> },
      { path: "/admin-dash/pacientes/historial/:id", element: <HistorialPaciente /> },
      { path: "/admin-dash/doctores", element: <DoctoresList /> },
      { path: "/admin-dash/doctores/:id", element: <Doctor /> },
      { path: "/admin-dash/finanzas", element: <Finanzas /> },
      { path: "/admin-dash/configuraciones", element: <MiClinica /> },
      { path: "/admin-dash/presupuestos", element: <Presupuestos /> },
    ],
  },
  {
    path: "/superadmin-dash",
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <SuperAdminDash /> },
      { path: "/superadmin-dash/tenants", element: <TenantsList /> },
      { path: "/superadmin-dash/tenants/:id/admin", element: <CreateAdminForTenant /> },
      { path: "/superadmin-dash/testimonios", element: <SuperAdminTestimonios /> },
      { path: "/superadmin-dash/ejemplos", element: <SuperAdminEjemplos /> },
      { path: "/superadmin-dash/servicios", element: <SuperAdminServicios /> },
      { path: "/superadmin-dash/servicios/editar/:id", element: <EditServicios /> },
      { path: "/superadmin-dash/chatbot", element: <SuperAdminChatbot /> },
      { path: "/superadmin-dash/mail-config", element: <SuperAdminMailConfig /> },
      { path: "/superadmin-dash/configuraciones", element: <SuperAdminConfiguraciones /> },
      { path: "/superadmin-dash/usuarios", element: <UsuariosList /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
