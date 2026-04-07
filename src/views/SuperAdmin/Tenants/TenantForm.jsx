import { useState, useEffect } from 'react';
import { X, UserPlus, Users } from 'lucide-react';
import clienteAxios from '../../../config/axios';

const PLANS = ['basic', 'pro', 'enterprise'];

const TenantForm = ({ tenant, onSaved, onClose }) => {
    const isEdit = !!tenant;

    const [form, setForm] = useState({ name: '', slug: '', plan: 'basic' });
    const [adminMode, setAdminMode] = useState('new'); // 'new' | 'existing' | 'none'
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tenant) {
            setForm({ name: tenant.name, slug: tenant.slug, plan: tenant.plan });
        }
    }, [tenant]);

    useEffect(() => {
        if (!isEdit) {
            clienteAxios.get('/api/superadmin/users')
                .then(({ data }) => setAllUsers(data))
                .catch(() => {});
        }
    }, [isEdit]);

    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setForm(prev => ({ ...prev, name, slug: isEdit ? prev.slug : slug }));
    };

    const filteredUsers = allUsers.filter(u =>
        !userSearch ||
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            if (isEdit) {
                await clienteAxios.put(`/api/superadmin/tenants/${tenant.id}`, form);
            } else {
                const { data: newTenant } = await clienteAxios.post('/api/superadmin/tenants', form);

                if (adminMode === 'new' && newAdmin.name && newAdmin.email && newAdmin.password) {
                    await clienteAxios.post(`/api/superadmin/tenants/${newTenant.id}/admin`, newAdmin);
                } else if (adminMode === 'existing' && selectedUserId) {
                    await clienteAxios.post(`/api/superadmin/tenants/${newTenant.id}/assign-admin`, {
                        user_id: Number(selectedUserId),
                    });
                }
            }
            onSaved();
        } catch (err) {
            const apiErrors = err.response?.data?.errors;
            setErrors(apiErrors && typeof apiErrors === 'object'
                ? apiErrors
                : { general: err.response?.data?.message || 'Error al guardar.' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isEdit ? 'Editar tenant' : 'Nuevo tenant'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                    {errors.general && (
                        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{errors.general}</p>
                    )}

                    {/* Datos del tenant */}
                    <fieldset className="space-y-3">
                        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Datos del tenant</legend>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={handleNameChange}
                                required
                                placeholder="Ej: Clínica Dental Sur"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                required
                                placeholder="clinica-dental-sur"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                            <select
                                value={form.plan}
                                onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                            >
                                {PLANS.map(p => (
                                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </fieldset>

                    {/* Admin inicial — solo al crear */}
                    {!isEdit && (
                        <fieldset className="space-y-3 border-t border-gray-100 pt-4">
                            <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Usuario admin inicial <span className="text-gray-300 font-normal">(opcional)</span>
                            </legend>

                            {/* Toggle */}
                            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm">
                                {[
                                    { id: 'none',     label: 'Sin admin',       icon: null },
                                    { id: 'existing', label: 'Usuario existente', icon: <Users size={13} /> },
                                    { id: 'new',      label: 'Nuevo usuario',    icon: <UserPlus size={13} /> },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setAdminMode(opt.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition ${
                                            adminMode === opt.id
                                                ? 'bg-violet-600 text-white font-medium'
                                                : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt.icon}{opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Seleccionar usuario existente */}
                            {adminMode === 'existing' && (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                        placeholder="Buscar por nombre o email..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                                    />
                                    <div className="max-h-44 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                                        {filteredUsers.length === 0 && (
                                            <p className="text-xs text-gray-400 text-center py-4">Sin resultados</p>
                                        )}
                                        {filteredUsers.map(u => (
                                            <label
                                                key={u.id}
                                                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition ${
                                                    selectedUserId == u.id ? 'bg-violet-50' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="existingUser"
                                                    value={u.id}
                                                    checked={selectedUserId == u.id}
                                                    onChange={() => setSelectedUserId(u.id)}
                                                    className="accent-violet-600"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                                </div>
                                                {u.tenants?.length > 0 && (
                                                    <span className="ml-auto text-xs text-gray-300 flex-shrink-0">
                                                        {u.tenants.length} clínica{u.tenants.length !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Crear nuevo usuario */}
                            {adminMode === 'new' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            value={newAdmin.name}
                                            onChange={e => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Dr. Juan Pérez"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={newAdmin.email}
                                            onChange={e => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="admin@clinica.com"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                                        />
                                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                        <input
                                            type="password"
                                            value={newAdmin.password}
                                            onChange={e => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                                            placeholder="Mínimo 8 caracteres"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                                        />
                                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                    </div>
                                </div>
                            )}
                        </fieldset>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-5 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition disabled:opacity-50">
                            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear tenant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TenantForm;
