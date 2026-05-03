/**
 * Modal simplificado: aparece cuando un paciente ya tiene cuenta en otro tenant.
 * Solo muestra sus datos (read-only) y pide confirmación para agregarlo.
 * NO pide contraseña — el user se reutiliza tal cual.
 */
const PatientImportModal = ({ foundData, onConfirm, onClose }) => {
    if (!foundData) return null;

    const fullName = [foundData.nompa, foundData.apepa].filter(Boolean).join(' ');

    const handleConfirm = () => {
        onConfirm({
            email:             foundData.email,
            nompa:             foundData.nompa,
            apepa:             foundData.apepa  ?? '',
            phon:              foundData.phon   ?? '',
            direc:             foundData.direc  ?? '',
            sex:               foundData.sex    ?? '',
            cump:              foundData.cump   ?? '',
            grup:              foundData.grup   ?? '',
            dni:               foundData.dni    ?? '',
            import_user_id:    foundData.user_id,
            source_patient_id: foundData.source_patient_id,
        });
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                style={{ animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
                {/* Header */}
                <div
                    className="px-6 py-5 text-white"
                    style={{ background: 'linear-gradient(135deg, #008DD2, #8cb9ce)' }}
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold leading-tight">Paciente encontrado</h3>
                                {foundData.source_tenant_name && (
                                    <p className="text-blue-100 text-sm mt-0.5">
                                        Clínica: <strong>{foundData.source_tenant_name}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Datos del paciente — solo lectura */}
                <div className="px-6 py-5 space-y-3">
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-20 flex-shrink-0">Nombre</span>
                            <span className="text-sm font-semibold text-slate-800">{fullName || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-20 flex-shrink-0">Email</span>
                            <span className="text-sm text-slate-700">{foundData.email}</span>
                        </div>
                        {foundData.dni && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 w-20 flex-shrink-0">DNI</span>
                                <span className="text-sm text-slate-700">{foundData.dni}</span>
                            </div>
                        )}
                        {foundData.phon && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 w-20 flex-shrink-0">Teléfono</span>
                                <span className="text-sm text-slate-700">{foundData.phon}</span>
                            </div>
                        )}
                    </div>

                    {/* Aviso de contraseña */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200">
                        <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                        </svg>
                        <p className="text-blue-700 text-xs leading-relaxed">
                            Este paciente ya tiene cuenta. Se agregará a esta clínica con su contraseña existente
                            — no necesitás crear una nueva.
                        </p>
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
                        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-105 active:scale-95 flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #008DD2, #8cb9ce)' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar a esta clínica
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

export default PatientImportModal;
