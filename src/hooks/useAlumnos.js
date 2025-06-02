// src/hooks/useAlumnos.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/apiClient';

export default function useAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchAlumnos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/alumnos');
      setAlumnos(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  }, []);

  const crear  = (payload)     => api.post('/alumnos', payload).then(fetchAlumnos);
  const editar = (id, payload) => api.put(`/alumnos/${id}`, payload).then(fetchAlumnos);
  const borrar = (id)          => api.delete(`/alumnos/${id}`).then(fetchAlumnos);

  useEffect(() => { fetchAlumnos(); }, [fetchAlumnos]);

  return { alumnos, loading, error, crear, editar, borrar, refetch: fetchAlumnos };
}
