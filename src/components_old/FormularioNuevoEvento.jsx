import { useState } from 'react';
import axios from 'axios';

export default function FormularioNuevoEvento({ onClose, onCreated }) {
  const [form, setForm] = useState({ titulo: '', fecha: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.fecha) return;
    await axios.post('http://localhost:3001/eventos', form);
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white p-6 rounded-lg space-y-4 w-80">
        <h2 className="text-lg font-semibold">Nuevo Evento</h2>
        <div>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título"
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancelar
          </button>
          <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}