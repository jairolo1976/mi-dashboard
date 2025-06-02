import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  GraduationCap,
  Calendar,
  Archive,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { nombre: 'Inicio', icono: Home, ruta: '/' },
    { nombre: 'Mensajes', icono: MessageSquare, ruta: '/mensajes' },
    { nombre: 'Alumnos', icono: GraduationCap, ruta: '/alumnos' },
    { nombre: 'Agenda', icono: Calendar, ruta: '/agenda' },
    { nombre: 'Casilleros', icono: Archive, ruta: '/casilleros' },
    { nombre: 'Configuración', icono: Settings, ruta: '/configuracion' }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-xl">
      <div className="text-3xl font-extrabold text-blue-400 mb-10 tracking-wider">
        CALYSM
      </div>
      <nav className="flex-1">
        <ul>
          {menu.map(item => {
            const Icon = item.icono;
            const active = location.pathname === item.ruta;
            return (
              <li key={item.ruta} className="mb-4">
                <button
                  onClick={() => navigate(item.ruta)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.nombre}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto text-center text-gray-400 text-sm">
        <p>&copy; 2024 CALYSM. Todos los derechos reservados.</p>
      </div>
    </aside>
  );
}
