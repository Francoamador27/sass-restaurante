import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import UseAuth from '../hooks/useAuth';
import TenantBlockedScreen from '../views/AdminDash/TenantBlockedScreen';

const AdminLayout = () => {
    const { user, error } = UseAuth({ middleware: 'auth' });
    const navigate = useNavigate();

    const [blocked, setBlocked] = useState(
        () => !!sessionStorage.getItem('TENANT_BLOCKED')
    );

    useEffect(() => {
        const handler = () => setBlocked(true);
        window.addEventListener('tenant-blocked', handler);
        return () => window.removeEventListener('tenant-blocked', handler);
    }, []);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user && !error) return <p>Cargando...</p>;
    if (!user || user.role !== 'admin') return null;

    if (blocked) return <TenantBlockedScreen />;

    return (
        <div className="admin-layout">
            <AdminSidebar />
        </div>
    );
};

export default AdminLayout;
