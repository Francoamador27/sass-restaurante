import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, CheckCircle, XCircle } from 'lucide-react';
import clienteAxios from '../../config/axios';

const SuperAdminDash = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const { data } = await clienteAxios.get('/api/superadmin/tenants');
                setTenants(data);
            } catch {
                setError('No se pudieron cargar los tenants.');
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, []);

    const totalUsuarios = tenants.reduce((acc, t) => acc + (t.users?.length ?? 0), 0);
    const activos = tenants.filter(t => t.active).length;
    const inactivos = tenants.length - activos;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Panel SuperAdmin</h1>
                <p className="text-gray-500 text-sm mt-1">Resumen global del sistema DentalCor</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Building2 size={22} />} label="Total Tenants" value={tenants.length} color="bg-violet-100 text-violet-700" />
                <StatCard icon={<Users size={22} />} label="Total Usuarios" value={totalUsuarios} color="bg-blue-100 text-blue-700" />
                <StatCard icon={<CheckCircle size={22} />} label="Activos" value={activos} color="bg-green-100 text-green-700" />
                <StatCard icon={<XCircle size={22} />} label="Inactivos" value={inactivos} color="bg-red-100 text-red-700" />
            </div>

            {/* Últimos tenants */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-700">Tenants recientes</h2>
                    <Link to="/superadmin-dash/tenants"
                        className="text-sm text-violet-600 hover:underline font-medium">
                        Ver todos →
                    </Link>
                </div>

                {loading && <p className="text-gray-400 text-sm">Cargando...</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {!loading && !error && tenants.length === 0 && (
                    <p className="text-gray-400 text-sm">No hay tenants registrados.</p>
                )}

                {!loading && !error && tenants.length > 0 && (
                    <div className="space-y-2">
                        {tenants.slice(0, 5).map(tenant => (
                            <div key={tenant.id}
                                className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{tenant.name}</p>
                                    <p className="text-xs text-gray-400">{tenant.slug} · {tenant.plan}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tenant.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {tenant.active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>
);

export default SuperAdminDash;
