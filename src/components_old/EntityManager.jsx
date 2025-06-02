// src/components/EntityManager.jsx
import React, { useEffect, useState, useCallback } from 'react';
import GenericForm from './GenericForm';
import EntityList   from './EntityList';
import { useToast } from '../contexts/ToastContext';

/**
 * Gestiona un CRUD completo (lista + formulario) para cualquier colección REST
 * ───────────────────────────────────────────────────────────────────────────
 * @param {string} apiUrl      – p. ej. import.meta.env.VITE_API_URL
 * @param {string} entityName  – nombre de la colección, ej. 'alumnos'
 * @param {Array}  fields      – configuración de campos que espera <GenericForm>
 */
export default function EntityManager({ apiUrl, entityName, fields }) {
  /* estado */
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [editItem, setEditItem] = useState(null);
  const  toast = useToast();

  /* ─ helpers ──────────────────────────────────────────────────────────── */
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/${entityName}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setItems(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, entityName]);

  /* primera carga */
  useEffect(() => { loadItems(); }, [loadItems]);

  /* crear */
  const handleCreated = () => loadItems();

  /* actualizar */
  const handleUpdated = () => {
    setEditItem(null);
    loadItems();
  };

  /* eliminar */
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar registro?')) return;
    try {
      const res = await fetch(`${apiUrl}/${entityName}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast('Registro eliminado');
      loadItems();
    } catch (err) {
      toast(`No se pudo eliminar: ${err.message || err}`);
    }
  };

  /* ─ render ───────────────────────────────────────────────────────────── */
  if (loading) return <p className="text-gray-500">Cargando…</p>;
  if (error)   return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-8">
      {/* Formulario (crea o edita) */}
      <GenericForm
        apiUrl={apiUrl}
        entityName={entityName}
        method={editItem ? 'PUT' : 'POST'}
        id={editItem?.id}
        initialData={editItem || {}}
        fields={fields}
        onSuccess={editItem ? handleUpdated : handleCreated}
      />

      {/* Lista */}
      <EntityList
        items={items}
        onEdit={setEditItem}
        onDelete={handleDelete}
        entityName={entityName}
      />
    </div>
  );
}

