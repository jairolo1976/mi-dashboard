import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Users, Calendar, Settings, MessageCircle } from 'lucide-react';
import { ToastProvider } from './contexts/ToastContext';
import Alumnos from './pages/Alumnos';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Configuracion from './pages/Configuracion';
import Messages from './pages/Messages';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <nav className="w-20 bg-white border-r flex flex-col items-center py-6 space-y-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `p-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                }`
              }
              aria-label="Dashboard"
            >
              <Home size={24} />
            </NavLink>
            <NavLink
              to="/alumnos"
              className={({ isActive }) =>
                `p-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                }`
              }
              aria-label="Alumnos"
            >
              <Users size={24} />
            </NavLink>
            <NavLink
              to="/agenda"
              className={({ isActive }) =>
                `p-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                }`
              }
              aria-label="Agenda"
            >
              <Calendar size={24} />
            </NavLink>
            <NavLink
              to="/configuracion"
              className={({ isActive }) =>
                `p-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                }`
              }
              aria-label="Configuración"
            >
              <Settings size={24} />
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `p-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                }`
              }
              aria-label="Mensajes"
            >
              <MessageCircle size={24} />
            </NavLink>
          </nav>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">Mi Dashboard</h1>
              {/* Placeholder for user/avatar */}
              <div className="flex items-center space-x-4">
                {/* e.g., user avatar, notifications, etc. */}
              </div>
            </header>

            {/* Routes */}
            <main className="p-6 overflow-y-auto flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alumnos" element={<Alumnos />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/messages" element={<Messages />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
