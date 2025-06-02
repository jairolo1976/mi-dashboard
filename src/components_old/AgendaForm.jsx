import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

export default function AgendaForm({ defaultValues = {}, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });
  const toast = useToast();

  const onSubmit = async (data) => {
    const isEdit = !!data.id;
    const url = isEdit
      ? `http://localhost:3001/eventos/${data.id}`
      : 'http://localhost:3001/eventos';
    try {
      if (isEdit) {
        await axios.put(url, data);
      } else {
        await axios.post(url, data);
        reset();
      }
      toast(`Evento ${isEdit ? 'actualizado' : 'creado'} correctamente`);
      onSuccess?.();
    } catch (err) {
      toast('Error al guardar el evento');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-4 rounded shadow"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Título<span className="text-red-500">*</span></label>
          <input
            {...register('titulo', { required: 'Obligatorio' })}
            className="w-full border p-2 rounded"
          />
          {errors.titulo && (
            <p className="text-sm text-red-600 mt-1">{errors.titulo.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Tipo<span className="text-red-500">*</span></label>
          <select
            {...register('tipo', { required: 'Obligatorio' })}
            className="w-full border p-2 rounded"
          >
            <option value="">Selecciona...</option>
            <option value="entrenamiento">Entrenamiento</option>
            <option value="partido">Partido</option>
            <option value="torneo">Torneo</option>
          </select>
          {errors.tipo && (
            <p className="text-sm text-red-600 mt-1">{errors.tipo.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Fecha<span className="text-red-500">*</span></label>
          <input
            type="date"
            {...register('fecha', { required: 'Obligatorio' })}
            className="w-full border p-2 rounded"
          />
          {errors.fecha && (
            <p className="text-sm text-red-600 mt-1">{errors.fecha.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Hora</label>
          <input type="time" {...register('hora')} className="w-full border p-2 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Lugar</label>
          <input {...register('lugar')} className="w-full border p-2 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Notas</label>
          <textarea {...register('notas')} className="w-full border p-2 rounded" />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando...' : defaultValues.id ? 'Guardar' : 'Crear'}
      </button>
    </form>
  );
}