import { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const SuperAdminConfiguraciones = () => {
    const [form, setForm] = useState({
        company_name: '',
        contact_email: '',
        sender_name: '',
        whatsapp: '',
        phone: '',
        address: '',
        business_hours: '',
        instagram: '',
        facebook: '',
        google_map_iframe: '',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [currentLogo, setCurrentLogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        clienteAxios.get('/api/settings')
            .then(({ data }) => {
                setForm({
                    company_name: data.company_name || '',
                    contact_email: data.contact_email || '',
                    sender_name: data.sender_name || '',
                    whatsapp: data.whatsapp || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    business_hours: data.business_hours || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    google_map_iframe: data.google_map_iframe || '',
                });
                if (data.logo) {
                    setCurrentLogo(data.logo.startsWith('http') ? data.logo : `${API_BASE}${data.logo}`);
                }
            })
            .catch(() => setErr('No se pudo cargar la configuración.'))
            .finally(() => setLoading(false));
    }, []);

    const handlePickLogo = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setErr('El logo no puede superar 2MB.'); return; }
        setErr(null);
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setErr(null);

        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (logoFile) formData.append('logo', logoFile);

        try {
            setSaving(true);
            const { data } = await clienteAxios.post('/api/superadmin/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMsg('Configuración guardada.');
            setLogoFile(null);
            setLogoPreview(null);
            if (data.settings?.logo) {
                const l = data.settings.logo;
                setCurrentLogo(l.startsWith('http') ? l : `${API_BASE}${l}`);
            }
        } catch {
            setErr('No se pudo guardar la configuración.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-sm text-slate-500">Cargando...</p>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Configuración global</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Datos de la empresa y del landing general de DentalCor.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {msg && <div className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">{msg}</div>}
                    {err && <div className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded text-sm">{err}</div>}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la empresa</label>
                            <input type="text" value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                                placeholder="DentalCor Software"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email de contacto</label>
                            <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                                placeholder="contacto@empresa.com"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre remitente</label>
                            <input type="text" value={form.sender_name} onChange={e => setForm(f => ({ ...f, sender_name: e.target.value }))}
                                placeholder="Equipo DentalCor"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                            <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="+54 11 1234-5678"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                            <input type="text" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                                placeholder="+54 9 11 1234-5678"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                placeholder="Av. Ejemplo 1234, Buenos Aires"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Horario</label>
                            <input type="text" value={form.business_hours} onChange={e => setForm(f => ({ ...f, business_hours: e.target.value }))}
                                placeholder="Lun–Vie 9:00–18:00"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
                            <input type="url" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                                placeholder="https://instagram.com/..."
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                            <input type="url" value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))}
                                placeholder="https://facebook.com/..."
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps iframe</label>
                            <textarea value={form.google_map_iframe} onChange={e => setForm(f => ({ ...f, google_map_iframe: e.target.value }))}
                                rows={3} placeholder='<iframe src="..." ...></iframe>'
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500 font-mono text-xs" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                            {(logoPreview || currentLogo) && (
                                <img src={logoPreview || currentLogo} alt="Logo"
                                    className="h-16 object-contain mb-2 rounded border border-slate-200 p-1" />
                            )}
                            <input type="file" accept="image/*" onChange={handlePickLogo}
                                className="block text-sm text-slate-600" />
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, SVG. Máx 2MB.</p>
                        </div>
                    </div>

                    <button type="submit" disabled={saving}
                        className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold ${saving ? 'bg-slate-400' : 'bg-violet-600 hover:bg-violet-700'}`}>
                        {saving ? 'Guardando…' : 'Guardar configuración'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminConfiguraciones;
