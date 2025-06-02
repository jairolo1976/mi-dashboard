import React, { useEffect, useState } from 'react';
import { PencilIcon, EyeIcon, MessageCircleIcon, XIcon } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function AlumnoList() {
  const toast = useToast();
  const [alumnos, setAlumnos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:3001/alumnos');
        if (!res.ok) throw new Error('Status ' + res.status);
        setAlumnos(await res.json());
      } catch (err) {
        toast('Error cargando alumnos: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  const categories = Array.from(new Set(alumnos.map(a => a.categoria)));
  const filtered = category ? alumnos.filter(a => a.categoria === category) : alumnos;

  const exportCSV = () => {
    const headers = ['Nombre','Edad','Categoría','Teléfono','Email'];
    const rows = alumnos.map(a => [a.nombre, a.edad, a.categoria, a.telefono, a.email]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumnos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="text-gray-500">Cargando alumnos…</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          Exportar a Excel
        </button>
      </div>
      <table className="min-w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2">Edad</th>
            <th className="px-4 py-2">Categoría</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((al) => (
            <tr
              key={al.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelected(al)}
            >
              <td className="px-4 py-2">{al.nombre}</td>
              <td className="px-4 py-2 text-center">{al.edad}</td>
              <td className="px-4 py-2 text-center">{al.categoria}</td>
              <td className="px-4 py-2 text-center">{al.telefono}</td>
              <td className="px-4 py-2 text-center">{al.email}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(al); }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  <EyeIcon size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toast('Función editar'); }}
                  className="text-yellow-600 hover:underline text-sm"
                >
                  <PencilIcon size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toast('Enviar mensaje'); }}
                  className="text-green-600 hover:underline text-sm"
                >
                  <MessageCircleIcon size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-4 space-y-2 shadow-lg">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="font-semibold">{selected.nombre}</h2>
              <button onClick={() => setSelected(null)}><XIcon size={18} /></button>
            </div>
            <p><strong>Edad:</strong> {selected.edad}</p>
            <p><strong>Categoría:</strong> {selected.categoria}</p>
            <p><strong>Teléfono:</strong> {selected.telefono}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <div className="flex justify-end pt-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}