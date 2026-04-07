import { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';

const SuperAdminMailConfig = () => {
    const [form, setForm] = useState({
        host: '',
        port: '',
        username: '',
        password: '',
        encryption: 'tls',
        from_email: '',
        from_name: '',
        admin_email: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        clienteAxios.get('/api/superadmin/mail-config')
            .then(({ data }) => {
                setForm({
                    host: data.host || '',
                    port: data.port != null ? String(data.port) : '',
                    username: data.username || '',
                    password: '',
                    encryption: data.encryption || 'tls',
                    from_email: data.from_email || '',
                    from_name: data.from_name || '',
                    admin_email: data.admin_email || '',
                });
            })
            .catch(() => setErr('No se pudo cargar la configuración SMTP.'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setErr(null);
        const payload = {
            host: form.host || null,
            port: form.port ? Number(form.port) : null,
            username: form.username || null,
            password: form.password || null,
            encryption: form.encryption,
            from_email: form.from_email || null,
            from_name: form.from_name || null,
            admin_email: form.admin_email || null,
        };
        try {
            setSaving(true);
            await clienteAxios.put('/api/superadmin/mail-config', payload);
            setMsg('Configuración SMTP global guardada.');
            setForm(f => ({ ...f, password: '' }));
        } catch {
            setErr('No se pudo guardar la configuración SMTP.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-sm text-slate-500">Cargando...</p>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Configuración de Mail Global</h1>
                <p className="text-sm text-slate-500 mt-1">
                    SMTP para el envío de formularios de contacto del landing general.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {msg && <div className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">{msg}</div>}
                    {err && <div className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded text-sm">{err}</div>}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Host</label>
                            <input type="text" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))}
                                placeholder="smtp.tu-dominio.com"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Puerto</label>
                            <input type="number" value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))}
                                placeholder="587"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                            <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                placeholder="usuario@dominio.com"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                            <div className="flex">
                                <input type={showPass ? 'text' : 'password'} value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    placeholder="••••••••"
                                    className="w-full border border-slate-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                <button type="button" onClick={() => setShowPass(s => !s)}
                                    className="px-3 border border-l-0 border-slate-300 rounded-r-lg text-sm text-slate-600 hover:bg-slate-50">
                                    {showPass ? 'Ocultar' : 'Ver'}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Si lo dejás vacío, se mantiene la actual.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Encriptación</label>
                            <select value={form.encryption} onChange={e => setForm(f => ({ ...f, encryption: e.target.value }))}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                <option value="none">Sin encriptación</option>
                                <option value="ssl">SSL (465)</option>
                                <option value="tls">TLS (587)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email remitente</label>
                            <input type="email" value={form.from_email} onChange={e => setForm(f => ({ ...f, from_email: e.target.value }))}
                                placeholder="no-reply@dominio.com"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre remitente</label>
                            <input type="text" value={form.from_name} onChange={e => setForm(f => ({ ...f, from_name: e.target.value }))}
                                placeholder="DentalCor"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email de destino (contacto)</label>
                            <input type="email" value={form.admin_email} onChange={e => setForm(f => ({ ...f, admin_email: e.target.value }))}
                                placeholder="admin@dentalcor.com"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            <p className="text-xs text-slate-400 mt-1">A este correo llegan los mensajes del formulario de contacto.</p>
                        </div>
                    </div>

                    <button type="submit" disabled={saving}
                        className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold ${saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {saving ? 'Guardando…' : 'Guardar SMTP global'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminMailConfig;
