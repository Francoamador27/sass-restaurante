import UseAuth from '../../hooks/useAuth';

const TenantBlockedScreen = () => {
    const info = JSON.parse(sessionStorage.getItem('TENANT_BLOCKED') || '{}');
    const { logout } = UseAuth({});

    const waUrl = info.whatsapp
        ? `https://wa.me/${info.whatsapp}?text=Hola%2C+necesito+reactivar+mi+cuenta+en+DentalCor`
        : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full text-center">

                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M12 15v2m-6.364-8.636A9 9 0 1118.364 18.364 9 9 0 015.636 8.364zM12 9v3" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Cuenta suspendida
                </h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    El acceso a tu clínica ha sido suspendido temporalmente.
                    Para reactivarlo, comunicáte con soporte.
                </p>

                {waUrl && (
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition hover:brightness-105 active:scale-95 mb-4"
                        style={{ background: '#25D366' }}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.336-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.374l-.36-.213-3.726.885.924-3.619-.234-.372A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
                        </svg>
                        Contactar por WhatsApp
                    </a>
                )}

                <br />
                <button
                    onClick={logout}
                    className="text-sm text-slate-400 hover:text-slate-600 mt-4 transition"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default TenantBlockedScreen;
