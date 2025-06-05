import React from 'react';

const Dashboard = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-6 flex flex-col">
      {/* Header con Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
          CF
        </div>
        <h1 className="text-xl font-bold text-red-400">CALYSM</h1>
        <p className="text-gray-400 text-sm">Sistema de Gestión CALYSM</p>
      </div>

      {/* Navegación */}
      <nav className="space-y-2">
        <a href="/" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <div className="w-5 h-5 border border-gray-400 rounded"></div>
          Inicio
        </a>
        <a href="/alumnos" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <div className="w-5 h-5 border border-gray-400 rounded"></div>
          Alumnos
        </a>
        <a href="/evaluaciones" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <div className="w-5 h-5 border border-gray-400 rounded"></div>
          Evaluaciones
        </a>
        <a href="/partidos" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <div className="w-5 h-5 border border-gray-400 rounded"></div>
          Partidos
        </a>
        <a href="/reportes" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <div className="w-5 h-5 border border-gray-400 rounded"></div>
          Reportes
        </a>
      </nav>

      {/* Usuario */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold">
            CV
          </div>
          <div>
            <p className="text-sm font-medium">Carlos Velasco</p>
            <p className="text-xs text-gray-400">Director Técnico</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
