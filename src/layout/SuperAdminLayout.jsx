import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UseAuth from '../hooks/useAuth';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

const SuperAdminLayout = () => {
    const { user, error } = UseAuth({ middleware: 'auth' });
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'superadmin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user && !error) return <p>Cargando...</p>;

    if (!user || user.role !== 'superadmin') return null;

    return (
        <div className="admin-layout">
            <SuperAdminSidebar />
        </div>
    );
};

export default SuperAdminLayout;
