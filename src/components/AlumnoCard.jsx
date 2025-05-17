import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

export default function AlumnoCard({ alumno, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: alumno.nombre,
    edad: alumno.edad.toString(),
    categoria: alumno.categoria,
    telefono: alumno.telefono,
    email: alumno.email
  });
  const toast = useToast();

  const handleEditChange = e =>
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    const updated = { ...editForm, edad: Number(editForm.edad) };
    try {
      await fetch(`http://localhost:3000/alumnos/${alumno.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      toast('Alumno actualizado');
      setEditing(false);
      onUpdated();
    } catch {
      toast('Error al actualizar');
    }
  };

  const del = async () => {
    if (!window.confirm(`¿Eliminar a ${alumno.nombre}?`)) return;
    try {
      const res = await fetch(`http://localhost:3000/alumnos/${alumno.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast('Alumno eliminado');
      onDeleted();
    } catch {
      toast('Error al eliminar');
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow">
      {editing ? (
        <form onSubmit={save} className="space-y-2">
          {['nombre', 'edad', 'categoria', 'telefono', 'email'].map(field => (
            <input
              key={field}
              name={field}
              value={editForm[field]}
              onChange={handleEditChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border rounded p-1"
            />
          ))}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">{alumno.nombre}</h2>
          <p><span className="font-medium">Edad:</span> {alumno.edad} años</p>
          <p><span className="font-medium">Categoría:</span> {alumno.categoria}</p>
          <p><span className="font-medium">Teléfono:</span> {alumno.telefono}</p>
          <p><span className="font-medium">Email:</span> {alumno.email}</p>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Editar
            </button>
            <button
              onClick={del}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
