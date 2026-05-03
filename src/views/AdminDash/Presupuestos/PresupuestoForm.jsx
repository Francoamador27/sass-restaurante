import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import clienteAxios from '../../../config/axios';
import PacientePicker from './PacientePicker';

const ESTADOS = [
    { value: 'borrador',  label: 'Borrador' },
    { value: 'publicado', label: 'Publicado' },
    { value: 'enviado',   label: 'Enviado' },
    { value: 'aceptado',  label: 'Aceptado' },
    { value: 'rechazado', label: 'Rechazado' },
];

const emptyItem = () => ({ descripcion: '', pieza: '', cantidad: 1, precio_unitario: '' });

const fmt = (n) => Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PresupuestoForm = ({ onCreated }) => {
    const today = new Date().toISOString().split('T')[0];
    const validez = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const [form, setForm] = useState({
        fecha: today,
        valido_hasta: validez,
        estado: 'publicado',
        paciente_nombre: '',
        paciente_email: '',
        paciente_telefono: '',
        paciente_dni: '',
        descuento: 0,
        notas: '',
    });
    const [items, setItems] = useState([emptyItem()]);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);

    const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const setItem = (idx, k, v) => {
        setItems(prev => prev.map((it, i) => i === idx ? { ...it, [k]: v } : it));
    };

    const addItem = () => setItems(prev => [...prev, emptyItem()]);
    const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

    const subtotalItem = (it) => (Number(it.cantidad) || 0) * (Number(it.precio_unitario) || 0);
    const subtotal     = items.reduce((acc, it) => acc + subtotalItem(it), 0);
    const descAmt      = subtotal * (Number(form.descuento) || 0) / 100;
    const total        = subtotal - descAmt;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);
        try {
            const { data } = await clienteAxios.post('/api/presupuestos', {
                ...form,
                descuento: Number(form.descuento) || 0,
                items: items.map((it, i) => ({
                    descripcion:     it.descripcion,
                    pieza:           it.pieza || null,
                    cantidad:        Number(it.cantidad),
                    precio_unitario: Number(it.precio_unitario),
                    orden:           i,
                })),
            });
            setSuccess(`Presupuesto ${data.numero} creado correctamente.`);
            setForm({ fecha: today, valido_hasta: validez, estado: 'publicado', paciente_nombre: '', paciente_email: '', paciente_telefono: '', paciente_dni: '', descuento: 0, notas: '' });
            setItems([emptyItem()]);
            onCreated?.(data);
        } catch (err) {
            const e = err.response?.data?.errors;
            setErrors(e && typeof e === 'object' ? e : { general: err.response?.data?.message || 'Error al guardar.' });
        } finally {
            setSaving(false);
        }
    };

    const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}
            {errors.general && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{errors.general}</div>}

            {/* Cabecera */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Datos del presupuesto</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Fecha</label>
                        <input type="date" value={form.fecha} onChange={e => setField('fecha', e.target.value)} className={inputCls} required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Válido hasta</label>
                        <input type="date" value={form.valido_hasta} onChange={e => setField('valido_hasta', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
                        <select value={form.estado} onChange={e => setField('estado', e.target.value)} className={inputCls}>
                            {ESTADOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Descuento (%)</label>
                        <input type="number" min="0" max="100" step="0.01" value={form.descuento} onChange={e => setField('descuento', e.target.value)} className={inputCls} placeholder="0" />
                    </div>
                </div>
            </div>

            {/* Paciente */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Paciente</h3>
                <PacientePicker
                    onSelect={(pacData) => setForm(f => ({ ...f, ...pacData }))}
                />
                {errors.paciente_nombre && (
                    <p className="text-xs text-red-500">{errors.paciente_nombre}</p>
                )}
            </div>

            {/* Líneas */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Tratamientos / Servicios</h3>

                {/* Header columnas */}
                <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-medium text-slate-400 px-1">
                    <div className="col-span-5">Descripción</div>
                    <div className="col-span-2">Pieza</div>
                    <div className="col-span-2">Cantidad</div>
                    <div className="col-span-2">Precio unit.</div>
                    <div className="col-span-1 text-right">Subtotal</div>
                </div>

                {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center group">
                        <div className="col-span-12 md:col-span-5">
                            <input
                                type="text"
                                value={it.descripcion}
                                onChange={e => setItem(idx, 'descripcion', e.target.value)}
                                placeholder="Ej: Extracción pieza 14"
                                required
                                className={inputCls}
                            />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                            <input
                                type="text"
                                value={it.pieza}
                                onChange={e => setItem(idx, 'pieza', e.target.value)}
                                placeholder="Pieza"
                                className={inputCls}
                            />
                        </div>
                        <div className="col-span-3 md:col-span-2">
                            <input
                                type="number"
                                value={it.cantidad}
                                onChange={e => setItem(idx, 'cantidad', e.target.value)}
                                min="0.01"
                                step="0.01"
                                required
                                className={inputCls}
                            />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                            <input
                                type="number"
                                value={it.precio_unitario}
                                onChange={e => setItem(idx, 'precio_unitario', e.target.value)}
                                min="0"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className={inputCls}
                            />
                        </div>
                        <div className="col-span-1 flex items-center justify-end gap-1">
                            <span className="text-sm font-medium text-slate-700 text-right hidden md:block">
                                ${fmt(subtotalItem(it))}
                            </span>
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="p-1 rounded text-red-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition mt-1"
                >
                    <Plus size={15} /> Agregar línea
                </button>

                {/* Totales */}
                <div className="border-t border-slate-100 pt-4 mt-2 space-y-2 text-sm">
                    <div className="flex justify-end gap-8">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium w-28 text-right">${fmt(subtotal)}</span>
                    </div>
                    {Number(form.descuento) > 0 && (
                        <div className="flex justify-end gap-8 text-red-500">
                            <span>Descuento ({form.descuento}%)</span>
                            <span className="font-medium w-28 text-right">- ${fmt(descAmt)}</span>
                        </div>
                    )}
                    <div className="flex justify-end gap-8 text-base font-bold text-slate-800">
                        <span>TOTAL</span>
                        <span className="w-28 text-right">${fmt(total)}</span>
                    </div>
                </div>
            </div>

            {/* Notas */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <label className="block text-xs font-medium text-slate-600 mb-1">Observaciones / Notas</label>
                <textarea
                    value={form.notas}
                    onChange={e => setField('notas', e.target.value)}
                    rows={3}
                    placeholder="Condiciones del presupuesto, aclaraciones, etc."
                    className={inputCls}
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-105 active:scale-95 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #008DD2, #8cb9ce)' }}
                >
                    {saving ? 'Guardando...' : 'Crear presupuesto'}
                </button>
            </div>
        </form>
    );
};

export default PresupuestoForm;
