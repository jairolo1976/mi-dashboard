import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Calendar, Archive, MessageSquare, Bell,
  UsersRound, Package, FileText, TrendingUp
} from 'lucide-react';
import {
  getAlumnos, getCasilleros, getEventos,
  getMensajes, getStaff, getAlertas
} from '../services/endpoints';

export default function Dashboard() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [casilleros, setCasilleros] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [alertasDB, setAlertasDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      getAlumnos().catch(() => []),
      getCasilleros().catch(() => []),
      getEventos().catch(() => []),
      getMensajes().catch(() => []),
      getStaff().catch(() => []),
      getAlertas().catch(() => [])
    ])
      .then(([a, c, e, m, s, al]) => {
        setAlumnos(a || []);
        setCasilleros(c || []);
        setEventos(e || []);
        setMensajes(m || []);
        setStaff(s || []);
        setAlertasDB(al || []);
      })
      .catch(err => {
        setError('Error al cargar los datos del dashboard.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-xl text-gray-600">Cargando dashboard...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-600">{error}</div>;

  // Cálculos
  const alumnosPorCategoria = {
    'Sub-10': 2,
    'Sub-12': 1,
    'Infantil': 1,
    'Cadete': 0,
    'Juvenil': 0,
    'Senior': 0
  };
  
  const totalCasilleros = 20;
  const casillerosOcupados = 12;
  const casillerosDisponibles = totalCasilleros - casillerosOcupados;
  const mensajesNoLeidos = mensajes.filter(m => !m.leido).length || 3;
  
  const proximosEventos = [
    { id: 1, fecha: '25/5/2025', nombre: 'Partido vs U.D. Las Palmas', equipo: 'Sub-10' },
    { id: 2, fecha: '28/5/2025', nombre: 'Entrenamiento intensivo', equipo: 'Sub-12' }
  ];

  // Función para obtener ícono según tipo
  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  // Filtrar solo alertas activas para el dashboard
  const alertasActivas = alertasDB.filter(alerta => alerta.activo);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Command Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Alumnos por Categoría */}
        <Card icon={<Users className="text-blue-600" />} title="Alumnos por Categoría">
          <ul className="space-y-1 mb-4">
            {Object.entries(alumnosPorCategoria).map(([cat, count]) => (
              <li key={cat} className="flex justify-between">
                <span>{cat}:</span>
                <span className="font-semibold">{count} alumnos</span>
              </li>
            ))}
          </ul>
          <LinkBtn to="/alumnos" color="blue">Ver Detalles</LinkBtn>
        </Card>

        {/* Próximos Eventos */}
        <Card icon={<Calendar className="text-green-600" />} title="Próximos Eventos">
          <ul className="space-y-2 mb-4">
            {proximosEventos.map(e => (
              <li key={e.id} className="text-sm">
                <div className="font-semibold">{e.fecha}: {e.nombre}</div>
                <div className="text-gray-600">{e.equipo}</div>
              </li>
            ))}
          </ul>
          <LinkBtn to="/agenda" color="green">Ir a Agenda</LinkBtn>
        </Card>

        {/* Casilleros */}
        <Card icon={<Archive className="text-yellow-600" />} title="Casilleros">
          <div className="mb-4">
            <p className="text-2xl font-bold">
              {casillerosOcupados}/{totalCasilleros}
              <span className="text-sm font-normal text-gray-600 ml-2">ocupados</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div 
                className="bg-yellow-600 h-3 rounded-full"
                style={{ width: `${(casillerosOcupados/totalCasilleros)*100}%` }}
              />
            </div>
          </div>
          <LinkBtn to="/casilleros" color="yellow">Administrar</LinkBtn>
        </Card>

        {/* Mensajes Pendientes */}
        <Card icon={<MessageSquare className="text-purple-600" />} title="Mensajes Pendientes">
          <div className="mb-4">
            <p className="text-3xl font-bold">{mensajesNoLeidos}</p>
            <p className="text-gray-600">no leídos</p>
            <p className="text-sm text-gray-500 mt-2">Revisa las últimas comunicaciones.</p>
          </div>
          <LinkBtn to="/mensajes" color="purple">Ver Mensajes</LinkBtn>
        </Card>

        {/* Alertas Importantes */}
        <Card icon={<Bell className="text-red-600" />} title="Alertas Importantes" span>
          <ul className="space-y-2 mb-4">
            {alertasActivas.length > 0 ? (
              alertasActivas.map(alerta => (
                <li key={alerta.id} className="flex items-start gap-2">
                  <span>{getTipoIcon(alerta.tipo)}</span>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${
                      alerta.tipo === 'error' ? 'text-red-700' : 
                      alerta.tipo === 'warning' ? 'text-orange-700' : 
                      alerta.tipo === 'success' ? 'text-green-700' :
                      'text-blue-700'
                    }`}>
                      {alerta.titulo}
                    </span>
                    {alerta.descripcion && (
                      <p className="text-xs text-gray-600 mt-1">{alerta.descripcion}</p>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 text-center py-4">
                No hay alertas activas
              </li>
            )}
          </ul>
          <button 
            onClick={() => navigate('/alertas')}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Gestionar Alertas
          </button>
        </Card>

        {/* Staff Registrado */}
        <Card icon={<UsersRound className="text-indigo-600" />} title="Staff Registrado">
          <div className="mb-4">
            <p className="text-3xl font-bold">{staff.length || 3}</p>
            <p className="text-gray-600">miembros</p>
            <p className="text-sm text-gray-500 mt-2">Ver el listado completo del personal.</p>
          </div>
          <LinkBtn to="/staff" color="indigo">Ver Staff</LinkBtn>
        </Card>

        {/* Equipamiento */}
        <Card icon={<Package className="text-teal-600" />} title="Equipamiento">
          <div className="mb-4">
            <p className="text-3xl font-bold">200+</p>
            <p className="text-gray-600">ítems</p>
            <p className="text-sm text-gray-500 mt-2">Gestiona el inventario de material deportivo.</p>
          </div>
          <LinkBtn to="/equipamiento" color="teal">Administrar</LinkBtn>
        </Card>

        {/* Documentos */}
        <Card icon={<FileText className="text-orange-600" />} title="Documentos">
          <div className="mb-4">
            <p className="text-3xl font-bold">15</p>
            <p className="text-gray-600">archivos</p>
            <p className="text-sm text-gray-500 mt-2">Fichas médicas, autorizaciones, reglamentos.</p>
          </div>
          <LinkBtn to="/documentos" color="orange">Ver Documentos</LinkBtn>
        </Card>

        {/* Reportes */}
        <Card icon={<TrendingUp className="text-pink-600" />} title="Reportes">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Genera informes detallados de rendimiento y asistencia.</p>
          </div>
          <LinkBtn to="/reportes" color="pink">Generar Reporte</LinkBtn>
        </Card>
      </div>
    </div>
  );
}

/* ── Componentes internos ─────────────────────────────────────────────── */
function Card({ icon, title, children, span }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 ${span ? 'lg:col-span-2' : ''}`}>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function LinkBtn({ to, color, children }) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    teal: 'bg-teal-600 hover:bg-teal-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    pink: 'bg-pink-600 hover:bg-pink-700'
  };

  return (
    <Link
      to={to}
      className={`block text-center px-4 py-2 text-white rounded-lg transition ${colorClasses[color] || colorClasses.blue}`}
    >
      {children}
    </Link>
  );
}