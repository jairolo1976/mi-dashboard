// src/components/EntityCard.jsx
import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

/**
 * EntityCard
 * Tarjeta que muestra datos y permite editar/eliminar.
 * Props:
 * - entity: objeto con `id` y demás campos.
 * - onEdit(entity): callback al clicar editar.
 * - onDelete(id): callback al clicar eliminar.
 */
export default function EntityCard({ entity, onEdit, onDelete }) {
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar a ${entity.nombre}?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/alumnos/${entity.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      // Espera breve para animación
      setTimeout(() => {
        toast('Registro eliminado');
        onDelete(entity.id);
      }, 300);
    } catch (err) {
      console.error(err);
      toast(`Error al eliminar: ${err.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow transition-opacity duration-300 ${
        isDeleting ? 'opacity-0' : 'opacity-100'
      }`}
      role="region"
      aria-label={`Entidad ${entity.id}`}
    >
      <h3 className="font-bold text-lg mb-2">{entity.nombre}</h3>
      <p><strong>Edad:</strong> {entity.edad}</p>
      <p><strong>Categoría:</strong> {entity.categoria}</p>
      {entity.telefono && <p><strong>Teléfono:</strong> {entity.telefono}</p>}
      {entity.email && <p><strong>Email:</strong> {entity.email}</p>}

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onEdit(entity)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          aria-label={`Editar ${entity.nombre}`}
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          aria-label={`Eliminar ${entity.nombre}`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
