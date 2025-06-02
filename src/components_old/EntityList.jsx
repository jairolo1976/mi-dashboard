import React from 'react';
import EntityCard from './EntityCard';

/**
 * Lista genérica de entidades.
 *
 * Props
 * - items      : array de objetos (cada uno debe tener id)
 * - onEdit     : (entity) => void
 * - onDelete   : (id) => void
 * - entityName : texto para el fallback cuando no hay registros
 */
export default function EntityList({
  items = [],
  onEdit,
  onDelete,
  entityName = 'entidades',
}) {
  if (!items.length) {
    return <p className="text-gray-500">No hay {entityName}.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <EntityCard
          key={item.id}
          entity={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
