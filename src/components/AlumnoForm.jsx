import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

export default function AlumnoForm({
  initialData = {},      // ← datos del alumno a editar (o {} si es creación)
  onCreated,             // ← callback tras POST exitoso
  onUpdated              // ← callback tras PUT exitoso
}) {
  const toast = useToast();

  // Estado del formulario, inicializado con initialData o vacío
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    categoria: '',
    telefono: '',
    email: ''
  });

  // Errores por campo
  const [errors, setErrors] = useState({});

  // Al montar, si vienen datos, relleno el formulario
  useEffect(() => {
    if (initialData.id) {
      setForm({
        nombre: initialData.nombre || '',
        edad: initialData.edad ?? '',
        categoria: initialData.categoria || '',
        telefono: initialData.telefono || '',
        email: initialData.email || ''
      });
    }
  }, [initialData]);

  // Detecta si estamos en modo edición
  const isEditMode = Boolean(initialData.id);

  // Validaciones por campo
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
      case 'categoria':
        if (!value.trim()) return 'Este campo es obligatorio';
        return '';
      case 'edad':
        if (!value) return 'La edad es obligatoria';
        const n = Number(value);
        if (!Number.isInteger(n)) return 'La edad debe ser un número entero';
        if (n < 5 || n > 99) return 'La edad debe estar entre 5 y 99';
        return '';
      case 'email':
        if (!value.trim()) return '';
        // regex básica
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email no válido';
        return '';
      case 'telefono':
        if (!value.trim()) return '';
        const phoneRegex = /^\d{6,}$/;
        if (!phoneRegex.test(value)) return 'Teléfono no válido (mínimo 6 dígitos)';
        return '';
      default:
        return '';
    }
  };

  // Al cambiar un input
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: validateField(name, value) }));
  };

  // Al enviar formulario
  const handleSubmit = async e => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      const error = validateField(key, val);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    // Si hay errores, aviso y corto
    if (Object.values(newErrors).some(Boolean)) {
      toast('Corrige los errores antes de enviar');
      return;
    }

    // Preparo URL y método
    const url = isEditMode
      ? `http://localhost:3000/alumnos/${initialData.id}`
      : 'http://localhost:3000/alumnos';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          edad: Number(form.edad)
        })
      });

      toast(isEditMode ? 'Alumno actualizado' : 'Alumno creado');

      // Limpiar o cerrar
      if (isEditMode) {
        onUpdated?.();
      } else {
        setForm({ nombre: '', edad: '', categoria: '', telefono: '', email: '' });
        setErrors({});
        onCreated?.();
      }
    } catch {
      toast('Error en la operación');
    }
  };

  // Deshabilitar botón si faltan campos o hay errores
  const isDisabled =
    !form.nombre.trim() ||
    !form.edad ||
    !form.categoria.trim() ||
    Object.values(errors).some(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {['nombre', 'edad', 'categoria', 'telefono', 'email'].map(field => (
          <div key={field}>
            <input
              name={field}
              type={
                field === 'edad'
                  ? 'number'
                  : field === 'email'
                  ? 'email'
                  : 'text'
              }
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field] && (
              <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full bg-blue-600 text-white py-2 rounded transition
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isEditMode ? 'Guardar cambios' : 'Añadir Alumno'}
      </button>
    </form>
  );
}
