import { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, X, User, ChevronRight } from 'lucide-react';
import clienteAxios from '../../../config/axios';

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30';

/** Debounce hook */
function useDebounce(value, delay = 350) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

/**
 * PacientePicker — buscador + selector + creación inline.
 * onSelect({ paciente_nombre, paciente_email, paciente_telefono, paciente_dni })
 */
const PacientePicker = ({ onSelect }) => {
    const [query, setQuery]       = useState('');
    const [results, setResults]   = useState([]);
    const [searching, setSearching] = useState(false);
    const [open, setOpen]         = useState(false);
    const [selected, setSelected] = useState(null);
    const [mode, setMode]         = useState('search'); // 'search' | 'create'
    const [creating, setCreating] = useState(false);
    const [createErr, setCreateErr] = useState(null);
    const [newPac, setNewPac]     = useState({ nompa: '', apepa: '', email: '', phon: '', dni: '', cump: '' });

    const debouncedQuery = useDebounce(query, 350);
    const wrapperRef = useRef(null);

    // Cerrar dropdown al hacer click afuera
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Buscar al tipear
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        clienteAxios.get('/api/pacientes', { params: { busqueda: debouncedQuery, per_page: 8 } })
            .then(({ data }) => setResults(data.data ?? []))
            .catch(() => setResults([]))
            .finally(() => setSearching(false));
    }, [debouncedQuery]);

    const selectPatient = (pac) => {
        const nombre = [pac.nompa, pac.apepa].filter(Boolean).join(' ');
        const payload = {
            paciente_nombre:    nombre,
            paciente_email:     pac.user?.email   ?? '',
            paciente_telefono:  pac.phon           ?? '',
            paciente_dni:       pac.user?.dni      ?? pac.dni ?? '',
        };
        setSelected({ ...pac, _nombre: nombre });
        setOpen(false);
        setQuery('');
        onSelect(payload);
    };

    const clearSelection = () => {
        setSelected(null);
        onSelect({ paciente_nombre: '', paciente_email: '', paciente_telefono: '', paciente_dni: '' });
    };

    const handleCreate = async () => {
        setCreateErr(null);
        setCreating(true);
        try {
            // Crear usuario + paciente via el endpoint existente
            // Contraseña automática: DNI si existe, sino los primeros 8 chars del email
            const autoPassword = newPac.dni
                ? newPac.dni.replace(/\D/g, '') // solo dígitos del DNI
                : newPac.email.split('@')[0].slice(0, 8);

            await clienteAxios.post('/api/pacientes', {
                nompa:    newPac.nompa,
                apepa:    newPac.apepa,
                email:    newPac.email,
                phon:     newPac.phon,
                dni:      newPac.dni,
                cump:     newPac.cump || null,
                password: autoPassword,
            });

            // Armar el payload directamente desde los datos del form
            const nombre = [newPac.nompa, newPac.apepa].filter(Boolean).join(' ');
            setSelected({ _nombre: nombre, user: { email: newPac.email }, phon: newPac.phon });
            onSelect({
                paciente_nombre:   nombre,
                paciente_email:    newPac.email,
                paciente_telefono: newPac.phon,
                paciente_dni:      newPac.dni,
            });
            setMode('search');
            setNewPac({ nompa: '', apepa: '', email: '', phon: '', dni: '', cump: '' });
        } catch (err) {
            const errs = err.response?.data?.errors;
            setCreateErr(errs
                ? Object.values(errs).flat().join(' · ')
                : err.response?.data?.message || 'Error al crear el paciente.');
        } finally {
            setCreating(false);
        }
    };

    // ── Render: paciente ya seleccionado ────────────────────────────────────
    if (selected) {
        return (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{selected._nombre}</p>
                    <p className="text-xs text-slate-400 truncate">
                        {[selected.user?.email, selected.phon].filter(Boolean).join('  ·  ')}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={clearSelection}
                    className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-400 transition flex-shrink-0"
                    title="Cambiar paciente"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    // ── Render: modo crear paciente ─────────────────────────────────────────
    if (mode === 'create') {
        return (
            <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <UserPlus size={15} className="text-blue-500" /> Nuevo paciente
                    </p>
                    <button
                        type="button"
                        onClick={() => { setMode('search'); setCreateErr(null); }}
                        className="text-xs text-slate-400 hover:text-slate-600 transition"
                    >
                        ← Volver a buscar
                    </button>
                </div>

                {createErr && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{createErr}</p>
                )}

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Nombre <span className="text-red-400">*</span></label>
                            <input type="text" value={newPac.nompa} onChange={e => setNewPac(p => ({ ...p, nompa: e.target.value }))} className={inputCls} placeholder="Juan" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Apellido</label>
                            <input type="text" value={newPac.apepa} onChange={e => setNewPac(p => ({ ...p, apepa: e.target.value }))} className={inputCls} placeholder="Pérez" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Email <span className="text-red-400">*</span></label>
                            <input type="email" value={newPac.email} onChange={e => setNewPac(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="juan@email.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">DNI</label>
                            <input type="text" value={newPac.dni} onChange={e => setNewPac(p => ({ ...p, dni: e.target.value }))} className={inputCls} placeholder="12.345.678" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono</label>
                            <input type="text" value={newPac.phon} onChange={e => setNewPac(p => ({ ...p, phon: e.target.value }))} className={inputCls} placeholder="+54 9 11 1234-5678" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de nacimiento</label>
                            <input type="date" value={newPac.cump} onChange={e => setNewPac(p => ({ ...p, cump: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setMode('search'); setCreateErr(null); }}
                            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={creating || !newPac.nompa || !newPac.email}
                            onClick={handleCreate}
                            className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #008DD2, #8cb9ce)' }}
                        >
                            {creating ? 'Creando...' : 'Crear y seleccionar'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render: modo búsqueda ───────────────────────────────────────────────
    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder="Buscar paciente por nombre, email o DNI..."
                    className="w-full pl-9 pr-3 border border-slate-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                />
                {searching && (
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                )}
            </div>

            {open && (query.length >= 2) && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                    {results.length > 0 ? (
                        <>
                            {results.map(pac => {
                                const nombre = [pac.nompa, pac.apepa].filter(Boolean).join(' ');
                                return (
                                    <button
                                        key={pac.idpa}
                                        type="button"
                                        onClick={() => selectPatient(pac)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <User size={14} className="text-slate-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">{nombre}</p>
                                            <p className="text-xs text-slate-400 truncate">
                                                {[pac.user?.email, pac.phon].filter(Boolean).join('  ·  ')}
                                            </p>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => { setOpen(false); setMode('create'); }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition border-t border-slate-100"
                            >
                                <UserPlus size={14} /> Crear nuevo paciente
                            </button>
                        </>
                    ) : (
                        <div className="px-4 py-5 text-center">
                            <p className="text-sm text-slate-400 mb-3">No se encontraron pacientes.</p>
                            <button
                                type="button"
                                onClick={() => { setOpen(false); setMode('create'); }}
                                className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline"
                            >
                                <UserPlus size={14} /> Crear nuevo paciente
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PacientePicker;
