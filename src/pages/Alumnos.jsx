// src/pages/Alumnos.jsx
import React from 'react'
import EntityManager from '../components/EntityManager'

/**
 * Configuración de los campos de Alumno.
 * Cada objeto describe:
 *  - name: clave en tu objeto (debe coincidir con tu DB)
 *  - label: texto que verá el usuario
 *  - type: tipo de input ('text', 'number', 'select', 'tel', 'email')
 *  - required: si es obligatorio
 *  - options: sólo para 'select'
 *  - validate: función que devuelve mensaje de error o null
 */
const fields = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text',
    required: true
  },
  {
    name: 'edad',
    label: 'Edad',
    type: 'number',
    required: true,
    validate: v => {
      const n = Number(v)
      if (isNaN(n) || n <= 0) return 'Edad debe ser un número válido'
      return null
    }
  },
  {
    name: 'categoria',
    label: 'Categoría',
    type: 'select',
    required: true,
    options: ['Benjamín', 'Alevín', 'Infantil']
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    type: 'tel',
    validate: v =>
      v && !/^\d{7,15}$/.test(v)
        ? 'Teléfono inválido (7–15 dígitos)'
        : null
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    validate: v =>
      v && !/\S+@\S+\.\S+/.test(v)
        ? 'Email inválido'
        : null
  }
]

/**
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
    </div>
  )
}
