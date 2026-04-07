import { useState, useRef, useEffect } from 'react';
import UseAuth from '../hooks/useAuth';

const roleLabel = (role) => {
    const map = { admin: 'Admin', doctor: 'Doctor', secretary: 'Secretario', patient: 'Paciente' };
    return map[role] ?? role;
};

const TenantSwitcher = () => {
    const { tenants, activeTenant, selectTenant } = UseAuth({});
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Cerrar al hacer click afuera
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const canSwitch = tenants && tenants.length > 1;

    const handleSelect = (tenant) => {
        if (tenant.id === activeTenant?.id) { setOpen(false); return; }
        selectTenant(tenant);
        setOpen(false);
        // Reload para limpiar estado en memoria del tenant anterior
        window.location.reload();
    };

    if (!activeTenant && (!tenants || tenants.length === 0)) return null;

    return (
        <div ref={ref} className="relative w-full">
            {/* Botón trigger — clickable solo si hay más de un tenant */}
            <button
                onClick={() => canSwitch && setOpen(!open)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 transition text-left ${canSwitch ? 'hover:bg-white/20 cursor-pointer' : 'cursor-default'}`}
            >
                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-400/50" />
                <span className="flex-1 text-xs font-medium text-white truncate">
                    {activeTenant?.name ?? tenants?.[0]?.name ?? 'Sin clínica'}
                </span>
                {canSwitch && (
                    <svg
                        className={`w-3.5 h-3.5 text-white/60 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 right-0 bottom-full mb-1 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    style={{ animation: 'switcherIn 0.15s ease' }}
                >
                    <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Cambiar clínica</p>
                    </div>
                    {tenants.map((t) => {
                        const isActive = t.id === activeTenant?.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => handleSelect(t)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-slate-50 transition ${isActive ? 'bg-blue-50' : ''}`}
                            >
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isActive ? 'text-[#008DD2]' : 'text-slate-700'}`}>
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-slate-400">{roleLabel(t.role)}</p>
                                </div>
                                {isActive && (
                                    <svg className="w-4 h-4 text-[#008DD2] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <style>{`
                @keyframes switcherIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default TenantSwitcher;
