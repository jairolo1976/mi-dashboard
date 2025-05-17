// src/pages/Agenda.jsx
import React from 'react';

/**
 * Página de Agenda
 * Aquí puedes integrar tu componente de calendario,
 * lista de citas o cualquier otra funcionalidad de agenda.
 */
export default function Agenda() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>
      {/* TODO: Sustituye este placeholder por tu calendario o lista de eventos */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Bienvenido a la Agenda. Aquí podrás ver y gestionar tus citas y recordatorios.
        </p>
        {/* Ejemplo de tarjeta de evento */}
        <ul className="mt-6 space-y-4">
          <li className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                09:00
              </span>
            </div>
            <div>
              <h3 className="font-semibold">Reunión de proyecto</h3>
              <p className="text-gray-500">Sala de conferencias A</p>
            </div>
          </li>
          <li className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                11:30
              </span>
            </div>
            <div>
              <h3 className="font-semibold">Llamada con cliente</h3>
              <p className="text-gray-500">Zoom</p>
            </div>
          </li>
          <li className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                15:00
              </span>
            </div>
            <div>
              <h3 className="font-semibold">Revisión de código</h3>
              <p className="text-gray-500">GitHub pull requests</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
