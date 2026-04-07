import axios from "axios";

const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

// Interceptor: agrega Authorization y X-Tenant-ID en cada request
clienteAxios.interceptors.request.use((config) => {
    const token        = localStorage.getItem('AUTH_TOKEN');
    const activeTenant = JSON.parse(localStorage.getItem('ACTIVE_TENANT') || 'null');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (activeTenant?.id) {
        config.headers['X-Tenant-ID'] = activeTenant.id;
    }

    return config;
});

// Interceptor: captura 402 (tenant pausado) y dispara pantalla de bloqueo
clienteAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 402 && error.response?.data?.blocked) {
            sessionStorage.setItem('TENANT_BLOCKED', JSON.stringify({
                whatsapp: error.response.data.whatsapp || '',
                message:  error.response.data.message  || '',
            }));
            window.dispatchEvent(new Event('tenant-blocked'));
        }
        return Promise.reject(error);
    }
);

export default clienteAxios;
