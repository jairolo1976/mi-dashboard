<<<<<<< Updated upstream
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
=======
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import {
  Home, MessageSquare, Users, Calendar, Settings,
  Archive, UsersRound, Package, TrendingUp, FileText, Bell, AlertTriangle
} from 'lucide-react';

import Dashboard  from './components/Dashboard';
import StaffList  from './components/StaffList';
import DashboardInicio from './pages/DashboardInicio';

/* --- placeholders --- */
import AlumnosPage from './pages/AlumnosPage';
import AlertasPage from './pages/AlertasPage';
const Mensajes = () => <Section>Mensajes</Section>;
const Agenda   = () => <Section>Agenda</Section>;
const Casilleros = () => <Section>Casilleros</Section>;
const Equipamiento = () => <Section>Equipamiento</Section>;
const Reportes = () => <Section>Reportes</Section>;
const Documentos = () => <Section>Documentos</Section>;
const Notificaciones = () => <Section>Notificaciones</Section>;
const Configuracion  = () => <Section>Configuración</Section>;

function Section(txt){ return <div className="p-6 text-2xl">{txt} (En desarrollo)</div>; }

/* ---------- Item sidebar ---------- */
function Item({ to, icon:Icon, label }) {
  const { pathname } = useLocation();
  const active = (to==='/'? pathname==='/' : pathname.startsWith(to));
  return (
    <li className="mb-2">
      <Link
        to={to}
        className={`flex items-center w-full px-4 py-2 rounded-lg transition
          ${active ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
      >
        <Icon size={18} className="mr-3" /> {label}
      </Link>
    </li>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <div className="flex min-h-screen font-sans">
        {/* ─ Sidebar ─ */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
          <h1 className="text-3xl font-extrabold text-blue-400 mb-8">CALYSM</h1>
          <nav className="flex-1">
            <ul>
              <Item to="/"             icon={Home}         label="Inicio"         />
              <Item to="/mensajes"     icon={MessageSquare} label="Mensajes"      />
              <Item to="/alumnos"      icon={Users}        label="Alumnos"        />
              <Item to="/agenda"       icon={Calendar}     label="Agenda"         />
              <Item to="/casilleros"   icon={Archive}      label="Casilleros"     />
              <Item to="/staff"        icon={UsersRound}   label="Staff"          />
              <Item to="/equipamiento" icon={Package}      label="Equipamiento"   />
              <Item to="/reportes"     icon={TrendingUp}   label="Reportes"       />
              <Item to="/documentos"   icon={FileText}     label="Documentos"     />
              <Item to="/alertas"      icon={AlertTriangle} label="Alertas"       />
              <Item to="/notificaciones" icon={Bell}       label="Notificaciones" />
              <Item to="/configuracion" icon={Settings}    label="Configuración"  />
            </ul>
          </nav>
          <p className="text-xs text-gray-500 mt-6">&copy; 2024 CALYSM</p>
        </aside>

        {/* ─ Contenido ─ */}
        <main className="flex-1 overflow-y-auto">
          <header className="bg-white p-6 shadow flex justify-between">
            <h2 className="text-xl font-semibold">¡A por todas, <strong>Carlos Velasco</strong>!</h2>
            <span className="text-gray-600">Centro de gestión deportiva</span>
          </header>

          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/mensajes"     element={<Mensajes />} />
            <Route path="/alumnos" element={<AlumnosPage />} />
            <Route path="/agenda"       element={<Agenda />} />
            <Route path="/casilleros"   element={<Casilleros />} />
            <Route path="/staff"        element={<StaffList />} />
            <Route path="/equipamiento" element={<Equipamiento />} />
            <Route path="/reportes"     element={<Reportes />} />
            <Route path="/documentos"   element={<Documentos />} />
            <Route path="/alertas"      element={<AlertasPage />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/configuracion"  element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
>>>>>>> Stashed changes
