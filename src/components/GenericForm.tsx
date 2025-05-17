// src/components/GenericForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

/**
 * Formulario genérico
 * Props:
 * - apiUrl: URL base de la API (e.g. http://localhost:3000)
 * - entityName: nombre de la entidad (e.g. 'alumnos')
 * - method: 'POST' o 'PUT'
 * - id: id en modo edición (opcional)
 * - initialData: datos iniciales en edición (opcional)
 * - fields: array de { name, label, type, options?, required?, validate? }
 * - onSuccess: callback tras crear/editar
 */
export default function GenericForm({
  apiUrl,
  entityName,
  method,
  id,
  initialData = {},
  fields,
  onSuccess,
}) {
  const toast = useToast();
  const [formData, setFormData] = useState({ ...initialData });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Resetea el formulario cuando cambian los datos iniciales
  useEffect(() => {
    setFormData({ ...initialData });
    setErrors({});
  }, [initialData]);

  // Valida los campos según required y validate()
  const validate = useCallback(() => {
    const newErrors = {};
    fields.forEach((f) => {
      const val = formData[f.name] ?? '';
      if (f.required && (val === '' || val == null)) {
        newErrors[f.name] = `${f.label} es obligatorio`;
      }
      if (f.validate && val !== '') {
        const msg = f.validate(val);
        if (msg) newErrors[f.name] = msg;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, fields]);

  // Maneja cambios en inputs y select
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : +value) : value,
    }));
  }, []);

  // Envía formulario: POST o PUT
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) {
        toast('Corrige los errores antes de continuar');
        return;
      }

      setLoading(true);
      try {
        const url = id
          ? `${apiUrl}/${entityName}/${id}`
          : `${apiUrl}/${entityName}`;
        // Prepara payload y convierte strings a numbers
        const payload = { ...formData };
        fields.forEach((f) => {
          if (f.type === 'number' && payload[f.name] !== '') {
            payload[f.name] = Number(payload[f.name]);
          }
        });

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        toast(
          method === 'POST'
            ? `${entityName} creado correctamente`
            : `${entityName} actualizado correctamente`
        );
        onSuccess();
      } catch (err) {
        toast(`Error de red: ${err.message || err}`, 5000);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, entityName, formData, id, method, onSuccess, toast, validate, fields]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
      role="form"
      aria-live="polite"
    >
      {fields.map((f) => {
        const value = formData[f.name] ?? '';
        const error = errors[f.name];
        return (
          <div key={f.name} className="flex flex-col">
            <label htmlFor={f.name} className="font-medium mb-1">
              {f.label}
              {f.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {f.type === 'select' ? (
              <select
                id={f.name}
                name={f.name}
                value={value}
                onChange={handleChange}
                disabled={loading}
                className={`border rounded p-2 focus:outline-none focus:ring ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!error}
                aria-describedby={error ? `${f.name}-error` : undefined}
              >
                <option value="">Selecciona...</option>
                {f.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={f.name}
                type={f.type}
                name={f.name}
                value={value}
                onChange={handleChange}
                disabled={loading}
                className={`border rounded p-2 focus:outline-none focus:ring ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!error}
                aria-describedby={error ? `${f.name}-error` : undefined}
              />
            )}

            {error && (
              <p
                id={`${f.name}-error`}
                className="text-red-600 mt-1 text-sm"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Procesando...' : method === 'POST' ? 'Añadir' : 'Guardar'}
      </button>
    </form>
  );
}
