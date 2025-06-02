// src/pages/Alumnos.jsx
import React from 'react';
import EntityManager from '../components/EntityManager';
import AlumnoList from '../components/AlumnoList';

<<<<<<< Updated upstream
/**
 * Configuración de los campos de Alumno.
 * Cada objeto describe:
 *  - name: clave en tu objeto (debe coincidir con tu DB)
=======
// URL base tomada de .env  →  VITE_API_URL=http://localhost:3001
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Configuración de los campos de Alumno.
 * Cada objeto describe:
 *  - name: clave en tu objeto (debe coincidir con la DB)
>>>>>>> Stashed changes
 *  - label: texto que verá el usuario
 *  - type: tipo de input ('text', 'number', 'select', 'tel', 'email')
 *  - required: si es obligatorio
 *  - options: sólo para 'select'
 *  - validate: función que devuelve mensaje de error o null
 */
const fields = [
  { name: 'nombre',  label: 'Nombre',  type: 'text',   required: true },
  { name: 'edad',    label: 'Edad',    type: 'number', required: true,
    validate: v => {
      const n = Number(v);
      if (isNaN(n) || n < 5 || n > 99) return 'Edad fuera de rango (5-99)';
      return null;
    }
  },
  { name: 'categoria', label: 'Categoría', type: 'select', required: true,
    options: ['Benjamín', 'Alevín', 'Infantil']
  },
  { name: 'telefono', label: 'Teléfono', type: 'tel',
    validate: v =>
      v && !/^\d{7,15}$/.test(v) ? 'Teléfono inválido (7-15 dígitos)' : null
  },
  { name: 'email', label: 'Email', type: 'email',
    validate: v =>
      v && !/\S+@\S+\.\S+/.test(v) ? 'Email inválido' : null
  }
];

/**
<<<<<<< Updated upstream
 * Página de gestión de Alumnos.
 * Usa EntityManager para CRUD completo contra http://localhost:3000/alumnos
 */
export default function Alumnos() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Alumnos</h1>
      <EntityManager
        apiUrl="http://localhost:3000"
        entityName="alumnos"
        fields={fields}
      />
=======
 * Página de gestión de Alumnos
 */
export default function Alumnos() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ─────────── Lista global + filtros + export ─────────── */}
      <h1 className="text-2xl font-bold">Alumnos</h1>
      <AlumnoList />

      {/* ─────────── Formulario CRUD ─────────── */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Añadir / Editar Alumno</h2>
        <EntityManager
          apiUrl={API_URL}
          entityName="alumnos"
          fields={fields}
        />
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
