import { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';

const SuperAdminEjemplos = () => {
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        obtenerImagenes();
    }, []);

    const obtenerImagenes = async () => {
        try {
            setCargando(true);
            const { data } = await clienteAxios.get('/api/ejemplos');
            setImagenes(data.data || data);
        } catch {
            // silent
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setErr('La imagen no puede superar 2MB.'); return; }
        setErr(null);
        setImagen(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setErr(null);
        if (!imagen) { setErr('Seleccioná una imagen.'); return; }
        const formData = new FormData();
        formData.append('imagen', imagen);
        try {
            setSaving(true);
            await clienteAxios.post('/api/superadmin/ejemplos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMsg('Imagen subida correctamente.');
            setImagen(null);
            setPreview(null);
            obtenerImagenes();
        } catch {
            setErr('Error al subir la imagen.');
        } finally {
            setSaving(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Eliminar esta imagen?')) return;
        try {
            await clienteAxios.delete(`/api/superadmin/ejemplos/${id}`);
            setMsg('Imagen eliminada.');
            obtenerImagenes();
        } catch {
            setErr('Error al eliminar la imagen.');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Galería de ejemplos</h1>
                <p className="text-gray-500 text-sm mt-1">Imágenes mostradas en la sección de galería del landing</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 max-w-md">
                <h2 className="font-semibold text-gray-700 mb-4">Subir imagen</h2>
                {msg && <div className="mb-3 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">{msg}</div>}
                {err && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded text-sm">{err}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {preview
                        ? <div className="relative w-full h-40 rounded overflow-hidden border border-gray-200">
                            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                            <button type="button" onClick={() => { setImagen(null); setPreview(null); }}
                                className="absolute top-1 right-1 bg-white text-red-600 text-xs px-2 py-1 rounded shadow">Quitar</button>
                        </div>
                        : <input type="file" accept="image/*" onChange={handleChange} className="text-sm text-gray-600" />
                    }
                    <button type="submit" disabled={saving}
                        className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${saving ? 'bg-slate-400' : 'bg-violet-600 hover:bg-violet-700'}`}>
                        {saving ? 'Subiendo...' : 'Subir'}
                    </button>
                </form>
            </div>

            <div>
                <h2 className="font-semibold text-gray-700 mb-3">Imágenes cargadas</h2>
                {cargando && <p className="text-gray-400 text-sm">Cargando...</p>}
                {!cargando && (
                    <div className="flex flex-wrap gap-4">
                        {imagenes.length === 0
                            ? <p className="text-gray-400 text-sm">No hay imágenes cargadas.</p>
                            : imagenes.map(img => (
                                <div key={img.id} className="w-40 h-40 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={`${import.meta.env.VITE_API_URL}storage/uploads${img.imagen}`}
                                        alt="" className="object-cover w-full h-full" />
                                    <button onClick={() => handleEliminar(img.id)}
                                        className="absolute top-1 right-1 bg-white text-red-600 text-xs px-2 py-1 rounded shadow hover:bg-red-50">
                                        Eliminar
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminEjemplos;
