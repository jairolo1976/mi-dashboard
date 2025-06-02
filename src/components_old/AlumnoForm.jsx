import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../contexts/ToastContext';

export default function AlumnoForm({ initialData = {}, onCreated, onUpdated }) {
  const toast = useToast();
  const isEdit = Boolean(initialData.id);

  // Inicializa el formulario con valores por defecto (vacíos o los que lleguen en initialData)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      nombre: initialData.nombre || '',
      edad: initialData.edad ?? '',
      categoria: initialData.categoria || '',
      telefono: initialData.telefono || '',
      email: initialData.email || '',
      grupoSanguineo: initialData.grupoSanguineo || '',
      alergias: initialData.alergias || '',
      medicacion: initialData.medicacion || ''
    }
  });

  const onSubmit = async (data) => {
    const url = isEdit
      ? `http://localhost:3001/alumnos/${initialData.id}`
      : 'http://localhost:3001/alumnos';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, edad: Number(data.edad) })
      });

      toast(isEdit ? 'Alumno actualizado' : 'Alumno creado');

      if (isEdit) {
        onUpdated?.();
      } else {
        onCreated?.();
        reset({
          nombre: '',
          edad: '',
          categoria: '',
          telefono: '',
          email: '',
          grupoSanguineo: '',
          alergias: '',
          medicacion: ''
        });
      }
    } catch {
      toast('Error en la operación');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Nombre */}
        <div>
          <input
            {...register('nombre', { required: 'Nombre es obligatorio' })}
            placeholder="Nombre"
            className="w-full border rounded p-2"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        {/* Edad */}
        <div>
          <input
            type="number"
            {...register('edad', {
              required: 'Edad es obligatoria',
              valueAsNumber: true,
              min: { value: 5, message: 'Edad mínima 5' },
              max: { value: 99, message: 'Edad máxima 99' }
            })}
            placeholder="Edad"
            className="w-full border rounded p-2"
          />
          {errors.edad && (
            <p className="mt-1 text-sm text-red-600">{errors.edad.message}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <select
            {...register('categoria', { required: 'Categoría obligatoria' })}
            className="w-full border rounded p-2"
          >
            <option value="">Selecciona categoría...</option>
            <option value="Benjamín">Benjamín</option>
            <option value="Alevín">Alevín</option>
            <option value="Infantil">Infantil</option>
          </select>
          {errors.categoria && (
            <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <input
            {...register('telefono', {
              pattern: {
                value: /^\d{6,}$/,
                message: 'Teléfono inválido (mínimo 6 dígitos)'
              }
            })}
            placeholder="Teléfono"
            className="w-full border rounded p-2"
          />
          {errors.telefono && (
            <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            {...register('email', {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email no válido'
              }
            })}
            placeholder="Email"
            className="w-full border rounded p-2"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Grupo sanguíneo */}
        <div>
          <input
            {...register('grupoSanguineo', { required: 'Grupo sanguíneo obligatorio' })}
            placeholder="Grupo sanguíneo"
            className="w-full border rounded p-2"
          />
          {errors.grupoSanguineo && (
            <p className="mt-1 text-sm text-red-600">{errors.grupoSanguineo.message}</p>
          )}
        </div>

        {/* Alergias */}
        <div>
          <input
            {...register('alergias')}
            placeholder="Alergias o enfermedades"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Medicación */}
        <div>
          <input
            {...register('medicacion')}
            placeholder="Medicación actual"
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-600 text-white py-2 rounded transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {isEdit ? 'Guardar cambios' : 'Añadir Alumno'}
      </button>
    </form>
  );
}
