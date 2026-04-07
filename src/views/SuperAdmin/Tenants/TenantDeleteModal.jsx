import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const TenantDeleteModal = ({ tenant, onConfirm, onClose }) => {
    const [inputName, setInputName] = useState('');
    const [deleteAdmins, setDeleteAdmins] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isValid = inputName === tenant.name;

    const handleConfirm = async () => {
        setDeleting(true);
        try {
            await onConfirm({ deleteAdmins });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: 'modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
                {/* Header rojo */}
                <div className="px-6 py-5 bg-red-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold leading-tight">Eliminar tenant</h3>
                            <p className="text-red-100 text-sm mt-0.5">{tenant.name}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Lo que se borrará */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-700 text-xs font-semibold mb-2 uppercase tracking-wide">
                            Se eliminará permanentemente:
                        </p>
                        <ul className="text-red-600 text-sm space-y-1">
                            {[
                                'Todos los pacientes y su historial clínico',
                                'Todos los profesionales y sus datos',
                                'Todas las citas y eventos',
                                'Todos los odontogramas y documentos',
                                'Todos los gastos y registros financieros',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Toggle: borrar admins */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                        <div className="relative mt-0.5 flex-shrink-0">
                            <input
                                type="checkbox"
                                checked={deleteAdmins}
                                onChange={(e) => setDeleteAdmins(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-checked:bg-red-500 rounded-full transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">
                                También eliminar las cuentas de los administradores
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Solo borra usuarios que no pertenezcan a otra clínica
                            </p>
                        </div>
                    </label>

                    {/* Input de confirmación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Escribí <span className="font-bold text-gray-900">"{tenant.name}"</span> para confirmar:
                        </label>
                        <input
                            type="text"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder={tenant.name}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!isValid || deleting}
                        className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                    >
                        {deleting ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar permanentemente'
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.94) translateY(-8px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default TenantDeleteModal;
