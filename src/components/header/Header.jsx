import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  LogIn,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import UseAuth from "../../hooks/useAuth";
import logo from "../../assets/img/logo/logo-blanco.png";
import logo_azul from "../../assets/img/logo/logo_azul.png";
import WhatsappHref from "../../utils/WhatsappUrl";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = UseAuth({ middleware: "guest" });
  const whatsappHref = WhatsappHref({ message: "" });

  // Efecto de scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Funcionalidades", href: "/servicios" },
    { label: "Páginas Web", href: "/paginas-web" },
    { label: "Quiénes Somos", href: "/quienes-somos" },
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50"
            : "bg-gradient-to-r from-blue-600/95 via-cyan-600/95 to-blue-600/95 backdrop-blur-md"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div
                className={`relative transition-all duration-300 ${
                  scrolled ? "scale-95" : "scale-100"
                }`}
              >
                {/* Logo con efecto glow */}
                <div className="relative">
                  <img
                    src={scrolled ? logo_azul : logo}
                    alt="DentalCor Logo"
                    className="h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                  {/* Efecto glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-black text-xl transition-colors ${
                    scrolled ? "text-slate-900" : "text-white"
                  }`}
                >
                  DentalCor
                </span>
                <span
                  className={`text-xs font-semibold transition-colors ${
                    scrolled ? "text-blue-600" : "text-blue-100"
                  }`}
                >
                  Software Odontológico
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      scrolled
                        ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA + User Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Badge promocional */}
              <div
                className={`hidden xl:flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  scrolled
                    ? "bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300/50"
                    : "bg-white/20 backdrop-blur border border-white/30"
                }`}
              >
                <Sparkles
                  className={`w-4 h-4 ${scrolled ? "text-yellow-600" : "text-yellow-300"}`}
                />
              </div>

              {!user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth/login"
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      scrolled
                        ? "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Iniciar sesión
                  </Link>

                  {/* boton a whatsapp */}
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/40 hover:scale-105"
                  >
                    <FaWhatsapp className="text-lg" />
                    Contactar
                  </a>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      scrolled
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                        : "bg-white/20 hover:bg-white/30 backdrop-blur text-white border border-white/30"
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.[0] || "U"}
                    </div>
                    <span className="hidden xl:block">Mi Cuenta</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <>
                      {/* Overlay para cerrar el dropdown */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      ></div>

                      <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideDown">
                        {/* Header del dropdown */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user?.name?.[0] || "U"}
                            </div>
                            <div>
                              <p className="text-white font-bold">
                                {user?.name || "Usuario"}
                              </p>
                              <p className="text-blue-100 text-sm">
                                {user?.email || "usuario@email.com"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                          <Link
                            to="/mi-cuenta"
                            className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <div>
                              <p className="font-semibold">Mi Cuenta</p>
                              <p className="text-xs text-slate-500">
                                Ver perfil y datos
                              </p>
                            </div>
                          </Link>

                          <div className="border-t border-slate-200 my-2"></div>

                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-5 py-3 w-full text-red-600 hover:bg-red-50 transition-all group"
                          >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                              <p className="font-semibold">Cerrar Sesión</p>
                              <p className="text-xs text-red-400">
                                Salir de tu cuenta
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className={`lg:hidden p-2.5 rounded-xl transition-all ${
                scrolled
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  : "bg-white/10 hover:bg-white/20 backdrop-blur text-white"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div id="mobile-menu" className="lg:hidden py-6 border-t border-white/10 animate-slideDown">
              <ul className="space-y-2 mb-6">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                        scrolled
                          ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                          : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile CTA */}
              <div className="space-y-3 px-4">
                {!user ? (
                  <>
                    <Link
                      to="/auth/login"
                      className={`block text-center px-5 py-3 rounded-xl font-semibold transition-all ${
                        scrolled
                          ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                          : "bg-white/10 backdrop-blur text-white hover:bg-white/20"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>

                    {/* boton a whatsapp */}
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all bg-green-500 hover:bg-green-600 text-white shadow-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaWhatsapp className="text-xl" />
                      Contactarme por WhatsApp
                    </a>
                  </>
                ) : (
                  <div
                    className={`rounded-xl p-4 ${
                      scrolled ? "bg-slate-100" : "bg-white/10 backdrop-blur"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p
                          className={`font-bold ${scrolled ? "text-slate-900" : "text-white"}`}
                        >
                          {user?.name || "Usuario"}
                        </p>
                        <p
                          className={`text-sm ${scrolled ? "text-slate-600" : "text-white/70"}`}
                        >
                          {user?.email || "usuario@email.com"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        to="/mi-cuenta"
                        className={`block px-4 py-2.5 rounded-lg font-semibold transition-all ${
                          scrolled
                            ? "bg-white text-slate-900 hover:bg-blue-50"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Mi Cuenta
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-center px-4 py-2.5 rounded-lg font-semibold text-red-500 hover:bg-red-50 transition-all"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
