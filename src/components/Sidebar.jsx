import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  MessageCircleIcon,
  GraduationCapIcon,
  CalendarIcon,
  ArchiveIcon,
  SettingsIcon,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { nombre: 'Inicio', icono: <HomeIcon />, ruta: '/' },
    { nombre: 'Mensajes', icono: <MessageCircleIcon />, ruta: '/mensajes' },
    { nombre: 'Alumnos', icono: <GraduationCapIcon />, ruta: '/alumnos' },
    { nombre: 'Agenda', icono: <CalendarIcon />, ruta: '/agenda' },
    { nombre: 'Casilleros', icono: <ArchiveIcon />, ruta: '/casilleros' },
    { nombre: 'Configuración', icono: <SettingsIcon />, ruta: '/configuracion' },
  ];

  return (
    <aside className="bg-[#1E2A38] text-white w-60 p-6 space-y-6">
      <h1 className="text-2xl font-semibold">CALYSM</h1>
      <nav className="space-y-4">
        {menu.map((item) => (
          <button
            key={item.nombre}
            onClick={() => navigate(item.ruta)}
            className="flex items-center w-full gap-3 px-4 py-2 rounded-xl hover:bg-[#2e3c4e] transition"
          >
            <span>{item.icono}</span>
            <span>{item.nombre}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
