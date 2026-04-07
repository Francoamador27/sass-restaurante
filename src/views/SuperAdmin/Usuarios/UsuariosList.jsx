import { useEffect, useState } from 'react';
import { Pencil, Search, Building2 } from 'lucide-react';
import clienteAxios from '../../../config/axios';
import UsuarioEditModal from './UsuarioEditModal';

const ROLE_BADGE = {
    superadmin: 'bg-purple-100 text-purple-700',
    admin:      'bg-blue-100 text-blue-700',
    user:       'bg-slate-100 text-slate-600',
};

const TENANT_ROLE_BADGE = {
    admin:     'bg-blue-50 text-blue-700',
    doctor:    'bg-emerald-50 text-emerald-700',
    secretary: 'bg-amber-50 text-amber-700',
    patient:   'bg-slate-50 text-slate-600',
};

const UsuariosList = () => {
    const [users, setUsers]           = useState([]);
    const [allTenants, setAllTenants] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [search, setSearch]         = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, tenantsRes] = await Promise.all([
                clienteAxios.get('/api/superadmin/users'),
                clienteAxios.get('/api/superadmin/tenants'),
            ]);
            setUsers(usersRes.data);
            setAllTenants(tenantsRes.data);
        } catch {
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSaved = (updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const filtered = users.filter(u => {
        const matchSearch = !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = !roleFilter || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
                    <p className="text-gray-500 text-sm mt-1">Todas las cuentas registradas en el sistema</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                >
                    <option value="">Todos los roles</option>
                    <option value="superadmin">SuperAdmin</option>
                    <option value="admin">Admin</option>
                    <option value="user">Usuario</option>
                </select>
            </div>

            {loading && <p className="text-gray-400 text-sm">Cargando...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!loading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuario</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Rol global</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Clínicas</th>
                                <th className="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-400 py-10">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_BADGE[user.role] ?? ROLE_BADGE.user}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.tenants.length === 0 ? (
                                            <span className="text-gray-300 text-xs flex items-center gap-1">
                                                <Building2 size={12} /> Sin clínica
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {user.tenants.map(t => (
                                                    <span
                                                        key={t.id}
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-transparent ${TENANT_ROLE_BADGE[t.role] ?? TENANT_ROLE_BADGE.patient}`}
                                                        title={t.role}
                                                    >
                                                        {t.name}
                                                        <span className="opacity-60 text-[10px]">· {t.role}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="p-1.5 rounded hover:bg-violet-50 text-violet-500 transition"
                                            title="Editar usuario"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && (
                <p className="text-xs text-gray-400 text-right">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</p>
            )}

            {editingUser && (
                <UsuarioEditModal
                    user={editingUser}
                    allTenants={allTenants}
                    onSaved={(updated) => { handleSaved(updated); setEditingUser(updated); }}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    );
};

export default UsuariosList;
