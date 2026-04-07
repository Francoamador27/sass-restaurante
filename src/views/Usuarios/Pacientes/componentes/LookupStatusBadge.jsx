/**
 * Badge que se muestra bajo el campo email o DNI
 * mientras se hace el lookup global de pacientes.
 */
const LookupStatusBadge = ({ status }) => {
    if (status === 'idle' || status === 'found') return null;

    const configs = {
        loading: {
            bg:   'bg-blue-50 border-blue-200',
            text: 'text-blue-700',
            icon: (
                <svg className="w-3.5 h-3.5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            ),
            label: 'Verificando en base de datos…',
        },
        not_found: {
            bg:   'bg-emerald-50 border-emerald-200',
            text: 'text-emerald-700',
            icon: (
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ),
            label: 'Paciente nuevo',
        },
        already_exists: {
            bg:   'bg-amber-50 border-amber-200',
            text: 'text-amber-700',
            icon: (
                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
            ),
            label: 'Este paciente ya está registrado en tu clínica',
        },
        error: null, // silencioso
    };

    const cfg = configs[status];
    if (!cfg) return null;

    return (
        <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
};

export default LookupStatusBadge;
