import { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';

const SuperAdminTestimonios = () => {
    const [tab, setTab] = useState('crear');
    const [testimonios, setTestimonios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({ nombre: '', texto: '', imagen: null });
    const [preview, setPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [formErr, setFormErr] = useState(null);

    const obtenerTestimonios = async () => {
        try {
            setCargando(true);
            const { data } = await clienteAxios.get('/api/testimonios');
            setTestimonios(data.data || data);
        } catch {
            setError('Error al obtener los testimonios');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (tab === 'ver') obtenerTestimonios();
    }, [tab]);

    const handleImagen = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) { setFormErr('La imagen no puede superar 3MB.'); return; }
        setFormErr(null);
        setForm(f => ({ ...f, imagen: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setFormErr(null);
        if (!form.nombre || !form.texto || !form.imagen) {
            setFormErr('Todos los campos son obligatorios.');
            return;
        }
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('texto', form.texto);
        formData.append('imagen', form.imagen);
        try {
            setSaving(true);
            await clienteAxios.post('/api/superadmin/testimonios', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMsg('Testimonio creado correctamente.');
            setForm({ nombre: '', texto: '', imagen: null });
            setPreview(null);
        } catch {
            setFormErr('Error al crear el testimonio.');
        } finally {
            setSaving(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Eliminar este testimonio?')) return;
        try {
            await clienteAxios.delete(`/api/superadmin/testimonios/${id}`);
            setTestimonios(prev => prev.filter(t => t.id !== id));
        } catch {
            alert('Error al eliminar el testimonio.');
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Testimonios</h1>
                <p className="text-gray-500 text-sm mt-1">Gestión de testimonios del landing</p>
            </div>

            <div className="flex gap-2">
                {['crear', 'ver'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            tab === t ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {t === 'crear' ? 'Nuevo testimonio' : 'Ver todos'}
                    </button>
                ))}
            </div>

            {tab === 'crear' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 max-w-md">
                    {msg && <div className="mb-3 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">{msg}</div>}
                    {formErr && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded text-sm">{formErr}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input type="text" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                            <textarea value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
                                rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                            {preview
                                ? <div className="relative w-full h-36 rounded overflow-hidden border border-gray-200">
                                    <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                                    <button type="button" onClick={() => { setForm(f => ({ ...f, imagen: null })); setPreview(null); }}
                                        className="absolute top-1 right-1 bg-white text-red-600 text-xs px-2 py-1 rounded shadow">Quitar</button>
                                </div>
                                : <input type="file" accept="image/*" onChange={handleImagen} className="text-sm text-gray-600" />
                            }
                        </div>
                        <button type="submit" disabled={saving}
                            className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${saving ? 'bg-slate-400' : 'bg-violet-600 hover:bg-violet-700'}`}>
                            {saving ? 'Guardando...' : 'Crear testimonio'}
                        </button>
                    </form>
                </div>
            )}

            {tab === 'ver' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {cargando && <p className="p-4 text-gray-400 text-sm">Cargando...</p>}
                    {error && <p className="p-4 text-red-500 text-sm">{error}</p>}
                    {!cargando && !error && (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Nombre</th>
                                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Texto</th>
                                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Imagen</th>
                                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {testimonios.length === 0
                                    ? <tr><td colSpan={4} className="text-center text-gray-400 py-8">No hay testimonios.</td></tr>
                                    : testimonios.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{t.nombre}</td>
                                            <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{t.texto}</td>
                                            <td className="px-4 py-3">
                                                <img src={`${import.meta.env.VITE_API_URL}storage/uploads/${t.imagen}`}
                                                    alt="" className="w-16 h-12 object-cover rounded" />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleEliminar(t.id)}
                                                    className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default SuperAdminTestimonios;
