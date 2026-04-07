import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import clienteAxios from '../../../config/axios';

const CreateAdminForTenant = () => {
    const { id } = useParams();
    const [tenant, setTenant] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        clienteAxios.get(`/api/superadmin/tenants/${id}`)
            .then(({ data }) => setTenant(data))
            .catch(() => setErrors({ general: 'No se pudo cargar el tenant.' }))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMsg(null);
        try {
            setSaving(true);
            await clienteAxios.post(`/api/superadmin/tenants/${id}/admin`, form);
            setMsg('Usuario admin creado correctamente.');
            setForm({ name: '', email: '', password: '' });
        } catch (err) {
            const apiErrors = err.response?.data?.errors;
            if (apiErrors) {
                setErrors(apiErrors);
            } else {
                setErrors({ general: err.response?.data?.message || 'Error al crear el usuario.' });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5 max-w-lg">
            <div className="flex items-center gap-3">
                <Link to="/superadmin-dash/tenants"
                    className="text-slate-500 hover:text-slate-700 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Crear usuario admin</h1>
                    {tenant && (
                        <p className="text-sm text-gray-500 mt-0.5">
                            Tenant: <span className="font-medium text-violet-700">{tenant.name}</span>
                        </p>
                    )}
                </div>
            </div>

            {loading && <p className="text-gray-400 text-sm">Cargando...</p>}

            {!loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {errors.general && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                            {errors.general}
                        </div>
                    )}
                    {msg && (
                        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
                            {msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                required
                                placeholder="Dr. Juan Pérez"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                                placeholder="admin@clinica.com"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                                minLength={8}
                                placeholder="Mínimo 8 caracteres"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
                        >
                            <UserPlus size={16} />
                            {saving ? 'Creando...' : 'Crear admin'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateAdminForTenant;
