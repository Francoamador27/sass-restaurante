import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, UserPlus, CheckCircle, XCircle, PauseCircle, PlayCircle } from 'lucide-react';
import clienteAxios from '../../../config/axios';
import TenantForm from './TenantForm';
import TenantDeleteModal from './TenantDeleteModal';

const TenantsList = () => {
    const [tenants, setTenants]           = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [showForm, setShowForm]         = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [deletingTenant, setDeletingTenant] = useState(null);
    const [pausingId, setPausingId]       = useState(null);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const { data } = await clienteAxios.get('/api/superadmin/tenants');
            setTenants(data);
        } catch {
            setError('No se pudieron cargar los tenants.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTenants(); }, []);

    const handleDeleteConfirm = async ({ deleteAdmins }) => {
        try {
            await clienteAxios.delete(`/api/superadmin/tenants/${deletingTenant.id}`, {
                data: { delete_admins: deleteAdmins },
            });
            setTenants(prev => prev.filter(t => t.id !== deletingTenant.id));
            setDeletingTenant(null);
        } catch {
            alert('Error al eliminar el tenant.');
        }
    };

    const handleToggleActive = async (tenant) => {
        try {
            const { data } = await clienteAxios.put(`/api/superadmin/tenants/${tenant.id}`, {
                active: !tenant.active,
            });
            setTenants(prev => prev.map(t => t.id === data.id ? data : t));
        } catch {
            alert('Error al cambiar el estado del tenant.');
        }
    };

    const handleTogglePaused = async (tenant) => {
        const action = tenant.paused ? 'reanudar' : 'pausar';
        if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} el tenant "${tenant.name}"?`)) return;

        setPausingId(tenant.id);
        try {
            const { data } = await clienteAxios.put(`/api/superadmin/tenants/${tenant.id}`, {
                paused: !tenant.paused,
            });
            setTenants(prev => prev.map(t => t.id === data.id ? data : t));
        } catch {
            alert(`Error al ${action} el tenant.`);
        } finally {
            setPausingId(null);
        }
    };

    const openCreate = () => { setEditingTenant(null); setShowForm(true); };
    const openEdit = (tenant) => { setEditingTenant(tenant); setShowForm(true); };
    const onFormSaved = () => { setShowForm(false); fetchTenants(); };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tenants</h1>
                    <p className="text-gray-500 text-sm mt-1">Clínicas registradas en DentalCor</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                    <Plus size={16} /> Nuevo tenant
                </button>
            </div>

            {loading && <p className="text-gray-400 text-sm">Cargando...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!loading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Nombre</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Slug</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Plan</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuarios</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
                                <th className="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center text-gray-400 py-8">
                                        No hay tenants registrados.
                                    </td>
                                </tr>
                            )}
                            {tenants.map(tenant => (
                                <tr key={tenant.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-medium text-gray-800">{tenant.name}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{tenant.slug}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium capitalize">
                                            {tenant.plan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{tenant.users?.length ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleToggleActive(tenant)}
                                                className="flex items-center gap-1 text-xs font-medium transition"
                                                title="Clic para activar/desactivar">
                                                {tenant.active
                                                    ? <><CheckCircle size={14} className="text-green-500" /><span className="text-green-600">Activo</span></>
                                                    : <><XCircle size={14} className="text-red-400" /><span className="text-red-500">Inactivo</span></>
                                                }
                                            </button>
                                            {tenant.paused && (
                                                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                                    Pausado
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/superadmin-dash/tenants/${tenant.id}/admin`}
                                                className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition" title="Crear admin">
                                                <UserPlus size={15} />
                                            </Link>
                                            <button onClick={() => openEdit(tenant)}
                                                className="p-1.5 rounded hover:bg-violet-50 text-violet-500 transition" title="Editar">
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleTogglePaused(tenant)}
                                                disabled={pausingId === tenant.id}
                                                className={`p-1.5 rounded transition disabled:opacity-40 ${tenant.paused ? 'hover:bg-green-50 text-green-500' : 'hover:bg-amber-50 text-amber-400'}`}
                                                title={tenant.paused ? 'Reanudar acceso' : 'Pausar (bloquear acceso)'}
                                            >
                                                {tenant.paused ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
                                            </button>
                                            <button onClick={() => setDeletingTenant(tenant)}
                                                className="p-1.5 rounded hover:bg-red-50 text-red-400 transition" title="Eliminar">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <TenantForm
                    tenant={editingTenant}
                    onSaved={onFormSaved}
                    onClose={() => setShowForm(false)}
                />
            )}

            {deletingTenant && (
                <TenantDeleteModal
                    tenant={deletingTenant}
                    onConfirm={handleDeleteConfirm}
                    onClose={() => setDeletingTenant(null)}
                />
            )}
        </div>
    );
};

export default TenantsList;
