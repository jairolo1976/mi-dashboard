import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Users, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings
} from 'lucide-react';
import { getAlumnos } from '../services/endpoints';

const EvaluacionesPage = () => {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    try {
      const data = await getAlumnos();
      setAlumnos(data);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simular evaluaciones pendientes (más adelante vendrán de la BD)
  const evaluacionesPendientes = {
    fisica: alumnos.length * 2,
    tecnica: alumnos.length,
    actitudinal: Math.floor(alumnos.length / 2)
  };

  const categorias = ['todas', ...new Set(alumnos.map(a => a.categoria).filter(Boolean))];

  const alumnosFiltrados = alumnos.filter(alumno => {
    if (filtroCategoria !== 'todas' && alumno.categoria !== filtroCategoria) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Evaluaciones
        </h1>
        <p className="text-gray-600">
          Registra las evaluaciones físicas, técnicas y actitudinales de los jugadores
        </p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Evaluaciones Físicas</p>
              <p className="text-2xl font-bold text-blue-900">{evaluacionesPendientes.fisica}</p>
              <p className="text-xs text-blue-600">Pendientes este mes</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Evaluaciones Técnicas</p>
              <p className="text-2xl font-bold text-green-900">{evaluacionesPendientes.tecnica}</p>
              <p className="text-xs text-green-600">Pendientes este mes</p>
            </div>
            <ClipboardCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Evaluaciones Actitudinales</p>
              <p className="text-2xl font-bold text-purple-900">{evaluacionesPendientes.actitudinal}</p>
              <p className="text-xs text-purple-600">Pendientes este mes</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'todas' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="completado">Completados</option>
              <option value="vencido">Vencidos</option>
            </select>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => navigate('/evaluaciones/configuracion')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Settings className="h-5 w-5" />
                Configuración
              </button>

              <button
                onClick={() => navigate('/evaluaciones/nueva')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <ClipboardCheck className="h-5 w-5" />
                Nueva Evaluación
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Jugadores */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jugador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eval. Física
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eval. Técnica
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eval. Actitudinal
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Evaluación
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alumnosFiltrados.map((alumno) => (
                <tr key={alumno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-gray-500 text-sm font-medium">
                          {alumno.numeroCamiseta || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {alumno.nombre} {alumno.apellido}
                        </div>
                        <div className="text-xs text-gray-500">
                          {alumno.posicion || 'Sin posición'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${alumno.categoria === 'Benjamín' ? 'bg-blue-100 text-blue-800' : ''}
                      ${alumno.categoria === 'Alevín' ? 'bg-green-100 text-green-800' : ''}
                      ${alumno.categoria === 'Infantil' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${alumno.categoria === 'Cadete' ? 'bg-purple-100 text-purple-800' : ''}
                      ${alumno.categoria === 'Juvenil' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {alumno.categoria || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Clock className="h-5 w-5 text-yellow-500 mx-auto" title="Pendiente" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Clock className="h-5 w-5 text-yellow-500 mx-auto" title="Pendiente" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" title="Completado" />
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    Hace 15 días
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/evaluaciones/jugador/${alumno.id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Evaluar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvaluacionesPage;
