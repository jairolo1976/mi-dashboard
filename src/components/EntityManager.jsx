// src/components/EntityManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import GenericForm from './GenericForm';
import EntityList from './EntityList';

export default function EntityManager({ apiUrl, entityName, fields }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1) carga / refresco
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/${entityName}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setItems(await res.json());
    } catch (err) {
      console.error(err);
      toast(`Error cargando ${entityName}: ${err.message}`, 5000);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, entityName, toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // 2) tras crear/editar
  const handleFormSuccess = () => {
    toast(
      editing
        ? `${entityName.slice(0, -1)} actualizado correctamente`
        : `${entityName.slice(0, -1)} creado correctamente`,
      3000
    );
    setEditing(null);
    fetchItems();
  };

  // 3) borrado
  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar ${entityName.slice(0, -1)}?`)) return;
    try {
      const res = await fetch(`${apiUrl}/${entityName}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      toast(`${entityName.slice(0, -1)} eliminado correctamente`, 3000);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast(`Error al eliminar: ${err.message}`, 5000);
    }
  };

  return (
    <div className="space-y-6">
      <GenericForm
        apiUrl={apiUrl}
        entityName={entityName}
        method={editing ? 'PUT' : 'POST'}
        id={editing?.id}
        initialData={editing || {}}
        fields={fields}
        onSuccess={handleFormSuccess}
      />

      {editing && (
        <button
          onClick={() => setEditing(null)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancelar edición
        </button>
      )}

      {loading 
        ? <p className="text-gray-500">Cargando {entityName}…</p>
        : (
            <EntityList
              items={items}
              onEdit={setEditing}
              onDelete={handleDelete}
              entityName={entityName}      // ← Muy importante pasarlo
            />
          )
      }
    </div>
  );
}
