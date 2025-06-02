// src/pages/DashboardInicio.jsx
import { Users, Calendar, MessageSquare, Archive, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardInicio() {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="bg-white p-6 shadow-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Hola, Jairo</h1>
        <p className="text-gray-600">Bienvenido al panel de CALYSM</p>
      </header>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido al panel de CALYSM</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Alumnos */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center text-center">
          <Users className="text-blue-600 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Alumnos</h3>
          <p className="text-gray-600 mb-4">Gestiona la lista de todos los alumnos.</p>
          <button
            onClick={() => navigate('/alumnos')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Ver Alumnos
          </button>
        </div>

        {/* Agenda */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center text-center">
          <Calendar className="text-green-600 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Agenda</h3>
          <p className="text-gray-600 mb-4">Consulta y gestiona el calendario de eventos.</p>
          <button
            onClick={() => navigate('/agenda')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            Ver Agenda
          </button>
        </div>

        {/* Mensajes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center text-center">
          <MessageSquare className="text-purple-600 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mensajes</h3>
          <p className="text-gray-600 mb-4">Revisa el historial de mensajes automáticos.</p>
          <button
            onClick={() => navigate('/mensajes')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Ver Mensajes
          </button>
        </div>

        {/* Casilleros */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center text-center">
          <Archive className="text-yellow-600 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Casilleros</h3>
          <p className="text-gray-600 mb-4">Gestión de casilleros (12/20 ocupados).</p>
          <button
            onClick={() => navigate('/casilleros')}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Administrar
          </button>
        </div>

        {/* Próximo Partido */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col items-center text-center">
          <CalendarDays className="text-red-600 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Próximo Partido</h3>
          <p className="text-gray-600 mb-4">C.F. Barcelona a las 14:30</p>
          <button
            onClick={() => navigate('/agenda')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Ver Partidos
          </button>
        </div>
      </div>
    </div>
  );
}
