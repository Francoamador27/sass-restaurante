import { useState, useCallback, useRef } from 'react';
import clienteAxios from '../../../../config/axios';

/**
 * Hook para buscar globalmente un paciente por email o DNI.
 *
 * Estados posibles:
 *  'idle'           — sin acción
 *  'loading'        — buscando
 *  'found'          — encontrado en otro tenant → abrir modal
 *  'not_found'      — no existe en ningún tenant → paciente nuevo
 *  'already_exists' — ya es paciente en este tenant
 *  'error'          — fallo de red (silencioso, no bloquea el form)
 */
export function usePatientLookup() {
    const [status, setStatus] = useState('idle');
    const [foundData, setFoundData] = useState(null);
    const abortRef = useRef(null);

    const triggerLookup = useCallback(async ({ email, dni }) => {
        const emailVal = email?.trim() ?? '';
        const dniVal   = dni?.trim()   ?? '';

        // No lanzar si no hay valor suficiente
        if (!emailVal && !dniVal) {
            setStatus('idle');
            setFoundData(null);
            return;
        }
        const searchVal = emailVal || dniVal;
        if (searchVal.length < 4) return;

        // Cancelar petición anterior si hay una en vuelo
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setStatus('loading');
        setFoundData(null);

        const token  = localStorage.getItem('AUTH_TOKEN');
        const params = {};
        if (emailVal) params.email = emailVal;
        else          params.dni   = dniVal;

        try {
            const { data } = await clienteAxios.get('/api/patient-lookup', {
                params,
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                signal: abortRef.current.signal,
            });

            if (data.found) {
                setFoundData(data);
                setStatus('found');
            } else if (data.already_in_tenant) {
                setStatus('already_exists');
            } else {
                setStatus('not_found');
            }
        } catch (err) {
            // Ignorar cancelaciones
            if (err?.code === 'ERR_CANCELED') return;
            // Cualquier otro error: silencioso para no bloquear el formulario
            setStatus('error');
        }
    }, []);

    const reset = useCallback(() => {
        abortRef.current?.abort();
        setStatus('idle');
        setFoundData(null);
    }, []);

    return { status, foundData, triggerLookup, reset };
}
