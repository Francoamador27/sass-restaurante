import { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const DatosClinica = () => {
    const [form, setForm] = useState({
        clinic_name: '',
        phone: '',
        email: '',
        address: '',
        whatsapp: '',
        business_hours: '',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [currentLogo, setCurrentLogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        clienteAxios.get('/api/tenant-settings')
            .then(({ data }) => {
                setForm({
                    clinic_name: data.clinic_name || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    address: data.address || '',
                    whatsapp: data.whatsapp || '',
                    business_hours: data.business_hours || '',
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
        if (file.size > 4 * 1024 * 1024) { setErr('El logo no puede superar 4MB.'); return; }
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
            const { data } = await clienteAxios.post('/api/tenant-settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMsg('Datos guardados correctamente.');
            setLogoFile(null);
            setLogoPreview(null);
            if (data.logo) {
                setCurrentLogo(data.logo.startsWith('http') ? data.logo : `${API_BASE}${data.logo}`);
            }
        } catch {
            setErr('No se pudo guardar la configuración.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-sm text-slate-500">Cargando...</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {msg && <div className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">{msg}</div>}
            {err && <div className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded text-sm">{err}</div>}

            <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la clínica</label>
                    <input
                        type="text"
                        value={form.clinic_name}
                        onChange={e => setForm(f => ({ ...f, clinic_name: e.target.value }))}
                        placeholder="Clínica Dental Sur"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+54 11 1234-5678"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="contacto@clinica.com"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                    <input
                        type="text"
                        value={form.whatsapp}
                        onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                        placeholder="+54 9 11 1234-5678"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Horario de atención</label>
                    <input
                        type="text"
                        value={form.business_hours}
                        onChange={e => setForm(f => ({ ...f, business_hours: e.target.value }))}
                        placeholder="Lun–Vie 9:00–18:00"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                    <input
                        type="text"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="Av. Ejemplo 1234, Ciudad"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Logo de la clínica</label>
                    {(logoPreview || currentLogo) && (
                        <img
                            src={logoPreview || currentLogo}
                            alt="Logo"
                            className="h-16 object-contain mb-2 rounded border border-slate-200 p-1"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePickLogo}
                        className="block text-sm text-slate-600"
                    />
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP. Máx 4MB.</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={saving}
                className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold ${saving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {saving ? 'Guardando…' : 'Guardar datos'}
            </button>
        </form>
    );
};

export default DatosClinica;
