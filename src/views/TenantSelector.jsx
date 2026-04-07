import { useNavigate } from 'react-router-dom';
import UseAuth from '../hooks/useAuth';
import { Building2 } from 'lucide-react';

const roleLabel = (role) => {
    const map = { admin: 'Administrador', doctor: 'Doctor', secretary: 'Secretario', patient: 'Paciente' };
    return map[role] ?? role;
};

const roleColor = (role) => {
    if (role === 'admin')     return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    if (role === 'doctor')    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (role === 'secretary') return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
};

const TenantSelector = () => {
    const navigate    = useNavigate();
    const { tenants, selectTenant, user, logout } = UseAuth({ middleware: 'auth' });

    const handleSelect = (tenant) => {
        selectTenant(tenant);
        if (tenant.role === 'admin') {
            navigate('/admin-dash');
        } else {
            navigate('/mi-cuenta');
        }
    };

    // Sin tenants asignados
    if (tenants.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#fefbf5' }}>
                <div className="w-full max-w-sm text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
                        <Building2 size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Sin clínicas asignadas</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                        Tu cuenta no está asignada a ninguna clínica activa.
                        Contactá al administrador del sistema.
                    </p>
                    <button
                        onClick={logout}
                        className="text-sm text-slate-400 hover:text-slate-600 transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#fefbf5' }}>
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #008DD2, #8cb9ce)' }}
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        ¿En qué clínica vas a trabajar?
                    </h1>
                    {user?.name && (
                        <p className="text-slate-500 mt-1 text-sm">
                            Bienvenido, <strong className="text-slate-700">{user.name}</strong>
                        </p>
                    )}
                </div>

                {/* Lista de tenants */}
                <div className="space-y-3">
                    {tenants.map((tenant) => {
                        const colors = roleColor(tenant.role);
                        return (
                            <button
                                key={tenant.id}
                                onClick={() => handleSelect(tenant)}
                                className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-[#008DD2] transition-all duration-200 group flex items-center gap-4"
                            >
                                {/* Ícono */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #008DD2, #8cb9ce)' }}
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{tenant.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{tenant.slug}</p>
                                </div>

                                {/* Badge de rol */}
                                <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                                    {roleLabel(tenant.role)}
                                </span>

                                {/* Flecha */}
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-[#008DD2] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-8">
                    Tu contraseña es la misma para todas las clínicas.
                </p>
            </div>
        </div>
    );
};

export default TenantSelector;
