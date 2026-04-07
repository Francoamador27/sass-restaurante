import { useState, useEffect } from 'react';
import { User, Building2, KeyRound, X, Plus, Trash2 } from 'lucide-react';
import clienteAxios from '../../../config/axios';

const ROLE_GLOBAL_OPTIONS = [
    { value: 'admin',      label: 'Admin (clínica)' },
    { value: 'user',       label: 'Usuario' },
    { value: 'superadmin', label: 'SuperAdmin' },
];

const ROLE_TENANT_OPTIONS = [
    { value: 'admin',     label: 'Admin' },
    { value: 'doctor',    label: 'Doctor' },
    { value: 'secretary', label: 'Secretario' },
    { value: 'patient',   label: 'Paciente' },
];

const TABS = [
    { id: 'datos',    label: 'Datos',     icon: <User size={15} /> },
    { id: 'tenants',  label: 'Clínicas',  icon: <Building2 size={15} /> },
    { id: 'password', label: 'Contraseña',icon: <KeyRound size={15} /> },
];

const UsuarioEditModal = ({ user, allTenants, onSaved, onClose }) => {
    const [tab, setTab] = useState('datos');

    // ── Tab Datos ────────────────────────────────────────────────────────────
    const [form, setForm]       = useState({ name: user.name, email: user.email, role: user.role ?? 'user' });
    const [savingData, setSavingData] = useState(false);
    const [dataMsg, setDataMsg] = useState(null);
    const [dataErr, setDataErr] = useState(null);

    // ── Tab Tenants ──────────────────────────────────────────────────────────
    const [tenantRows, setTenantRows] = useState(
        user.tenants.map(t => ({ tenant_id: t.id, role: t.role }))
    );
    const [savingTenants, setSavingTenants]   = useState(false);
    const [tenantsMsg, setTenantsMsg]         = useState(null);
    const [tenantsErr, setTenantsErr]         = useState(null);

    // ── Tab Password ─────────────────────────────────────────────────────────
    const [password, setPassword]             = useState('');
    const [savingPwd, setSavingPwd]           = useState(false);
    const [pwdMsg, setPwdMsg]                 = useState(null);
    const [pwdErr, setPwdErr]                 = useState(null);

    // ── Guardar datos básicos ─────────────────────────────────────────────
    const handleSaveData = async () => {
        setDataMsg(null); setDataErr(null);
        setSavingData(true);
        try {
            const { data } = await clienteAxios.put(`/api/superadmin/users/${user.id}`, form);
            setDataMsg('Datos actualizados.');
            onSaved(data);
        } catch (e) {
            setDataErr(e.response?.data?.message || 'Error al guardar.');
        } finally {
            setSavingData(false);
        }
    };

    // ── Agregar fila tenant ──────────────────────────────────────────────
    const addTenantRow = () => {
        const usedIds = tenantRows.map(r => r.tenant_id);
        const next = allTenants.find(t => !usedIds.includes(t.id));
        if (!next) return;
        setTenantRows(prev => [...prev, { tenant_id: next.id, role: 'admin' }]);
    };

    const updateTenantRow = (idx, field, value) => {
        setTenantRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: field === 'tenant_id' ? Number(value) : value } : r));
    };

    const removeTenantRow = (idx) => {
        setTenantRows(prev => prev.filter((_, i) => i !== idx));
    };

    // ── Guardar tenants ──────────────────────────────────────────────────
    const handleSaveTenants = async () => {
        setTenantsMsg(null); setTenantsErr(null);
        setSavingTenants(true);
        try {
            const { data } = await clienteAxios.put(`/api/superadmin/users/${user.id}/tenants`, {
                tenants: tenantRows,
            });
            setTenantsMsg('Clínicas actualizadas.');
            onSaved(data);
        } catch (e) {
            setTenantsErr(e.response?.data?.message || 'Error al guardar.');
        } finally {
            setSavingTenants(false);
        }
    };

    // ── Resetear contraseña ──────────────────────────────────────────────
    const handleResetPassword = async () => {
        if (password.length < 8) { setPwdErr('Mínimo 8 caracteres.'); return; }
        setPwdMsg(null); setPwdErr(null);
        setSavingPwd(true);
        try {
            const { data } = await clienteAxios.post(`/api/superadmin/users/${user.id}/reset-password`, { password });
            setPwdMsg(data.message);
            setPassword('');
        } catch (e) {
            setPwdErr(e.response?.data?.message || 'Error al resetear.');
        } finally {
            setSavingPwd(false);
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
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{ animation: 'modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)', maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-violet-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition -mb-px ${
                                tab === t.id
                                    ? 'border-violet-600 text-violet-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* Contenido con scroll */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    {/* ── Tab Datos ── */}
                    {tab === 'datos' && (
                        <>
                            {dataMsg && <p className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-sm">{dataMsg}</p>}
                            {dataErr && <p className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm">{dataErr}</p>}

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Rol global</label>
                                <select
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                                >
                                    {ROLE_GLOBAL_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleSaveData}
                                disabled={savingData}
                                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition disabled:opacity-50 mt-2"
                            >
                                {savingData ? 'Guardando...' : 'Guardar datos'}
                            </button>
                        </>
                    )}

                    {/* ── Tab Tenants ── */}
                    {tab === 'tenants' && (
                        <>
                            {tenantsMsg && <p className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-sm">{tenantsMsg}</p>}
                            {tenantsErr && <p className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm">{tenantsErr}</p>}

                            <div className="space-y-2">
                                {tenantRows.length === 0 && (
                                    <p className="text-slate-400 text-sm text-center py-4">Sin clínicas asignadas.</p>
                                )}
                                {tenantRows.map((row, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <select
                                            value={row.tenant_id}
                                            onChange={e => updateTenantRow(idx, 'tenant_id', e.target.value)}
                                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                                        >
                                            {allTenants.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={row.role}
                                            onChange={e => updateTenantRow(idx, 'role', e.target.value)}
                                            className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                                        >
                                            {ROLE_TENANT_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => removeTenantRow(idx)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition flex-shrink-0"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addTenantRow}
                                disabled={tenantRows.length >= allTenants.length}
                                className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 disabled:opacity-40 transition"
                            >
                                <Plus size={15} /> Agregar clínica
                            </button>

                            <button
                                onClick={handleSaveTenants}
                                disabled={savingTenants}
                                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition disabled:opacity-50 mt-2"
                            >
                                {savingTenants ? 'Guardando...' : 'Guardar clínicas'}
                            </button>
                        </>
                    )}

                    {/* ── Tab Contraseña ── */}
                    {tab === 'password' && (
                        <>
                            {pwdMsg && <p className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-sm">{pwdMsg}</p>}
                            {pwdErr && <p className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm">{pwdErr}</p>}

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
                                Al resetear la contraseña se cerrarán todas las sesiones activas del usuario.
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                                />
                            </div>

                            <button
                                onClick={handleResetPassword}
                                disabled={savingPwd || password.length < 8}
                                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50 mt-2"
                            >
                                {savingPwd ? 'Reseteando...' : 'Resetear contraseña'}
                            </button>
                        </>
                    )}
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

export default UsuarioEditModal;
