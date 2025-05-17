// src/pages/Configuracion.jsx
import React, { useState } from 'react';

/**
 * Página de Configuración
 * Aquí puedes gestionar ajustes de tu aplicación:
 * temas, notificaciones, perfil de usuario, etc.
 */
export default function Configuracion() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Modo oscuro */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Modo oscuro</span>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors ${
              darkMode ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
            }`}
            aria-pressed={darkMode}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow" />
          </button>
        </div>

        {/* Notificaciones */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Notificaciones</span>
          <button
            onClick={() => setNotifications((prev) => !prev)}
            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors ${
              notifications ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
            }`}
            aria-pressed={notifications}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow" />
          </button>
        </div>

        {/* Perfil de usuario (placeholder) */}
        <div>
          <h2 className="font-semibold mb-2">Perfil de usuario</h2>
          <p className="text-gray-600">
            Aquí podrás actualizar tus datos de usuario, cambiar contraseña o editar preferencias.
          </p>
        </div>
      </div>
    </div>
  );
}
