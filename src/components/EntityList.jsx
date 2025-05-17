// src/components/EntityCard.jsx
import React, { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

/**
 * EntityCard
 * Tarjeta que muestra datos de una entidad y permite editar o eliminar.
 *
 * Props:
 * - entity: objeto con los datos de la entidad (debe tener `id`, `nombre`, `edad`, `categoria`, etc.).
 * - onEdit: (entity) => void        — Callback cuando se pulsa “Editar”.
 * - onDelete: (id) => void          — Callback cuando se confirma “Eliminar”.
 */
export default function EntityCard({ entity, onEdit, onDelete }) {
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    // Confirmación
    if (!window.confirm(`¿Eliminar a ${entity.nombre}?`)) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`http://localhost:3000/alumnos/${entity.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // Pequeña pausa para la animación de desvanecimiento
      setTimeout(() => {
        toast('Registro eliminado correctamente');
        onDelete(entity.id);
      }, 300);
    } catch (err) {
      console.error('Error al eliminar:', err);
      toast(`Error al eliminar: ${err.message || err}`, 5000);
      setIsDeleting(false);
    }
  }, [entity, onDelete, toast]);

  return (
    <div
      role="region"
      aria-label={`Entidad ${entity.nombre}`}
      className={`
        p-4 border rounded-lg shadow-md
        transition-opacity duration-300
        ${isDeleting ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <h3 className="font-bold text-lg mb-2">{entity.nombre}</h3>
      <p><strong>Edad:</strong> {entity.edad} años</p>
      <p><strong>Categoría:</strong> {entity.categoria}</p>
      {entity.telefono && <p><strong>Teléfono:</strong> {entity.telefono}</p>}
      {entity.email   && <p><strong>Email:</strong>   {entity.email}</p>}

      <div className="mt-4 flex space-x-2">
        <button
          type="button"
          onClick={() => onEdit(entity)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded focus:outline-none focus:ring"
          aria-label={`Editar ${entity.nombre}`}
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none focus:ring disabled:opacity-50"
          aria-label={`Eliminar ${entity.nombre}`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
