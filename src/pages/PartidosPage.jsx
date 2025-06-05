import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const PartidosPage = () => {
  const navigate = useNavigate();
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    victorias: 0,
    empates: 0,
    derrotas: 0,
    golesFavor: 0,
    golesContra: 0
  });

  useEffect(() => {
    cargarPartidos();
  }, []);

  const cargarPartidos = async () => {
    try {
      const response = await apiClient.get('/partidos');
      setPartidos(response.data);
      calcularEstadisticas(response.data);
    } catch (error) {
      console.error('Error cargando partidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (partidosData) => {
    const stats = partidosData.reduce((acc, partido) => {
      if (partido.resultado === 'Victoria') acc.victorias++;
      else if (partido.resultado === 'Empate') acc.empates++;
      else if (partido.resultado === 'Derrota') acc.derrotas++;
      
      acc.golesFavor += partido.golesPropio || 0;
      acc.golesContra += partido.golesRival || 0;
      
      return acc;
    }, {
      victorias: 0,
      empates: 0,
      derrotas: 0,
      golesFavor: 0,
      golesContra: 0
    });
    
    setStats(stats);
  };

  const getResultadoColor = (resultado) => {
    switch (resultado) {
      case 'Victoria': return 'text-green-700 bg-green-100';
      case 'Empate': return 'text-amber-700 bg-amber-100';
      case 'Derrota': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Gestión de Partidos</h1>
            <p className="text-slate-600 mt-2">Sistema integral de análisis y seguimiento deportivo</p>
          </div>
          <button
            onClick={() => navigate('/partidos/nuevo')}
            className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            + Nuevo Partido
          </button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Partidos</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">{partidos.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Victorias</div>
            <div className="text-3xl font-bold text-green-700 mt-2">{stats.victorias}</div>
            <div className="text-xs text-slate-500 mt-1">
              {partidos.length > 0 ? `${((stats.victorias / partidos.length) * 100).toFixed(0)}%` : '0%'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Empates</div>
            <div className="text-3xl font-bold text-amber-600 mt-2">{stats.empates}</div>
            <div className="text-xs text-slate-500 mt-1">
              {partidos.length > 0 ? `${((stats.empates / partidos.length) * 100).toFixed(0)}%` : '0%'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Derrotas</div>
            <div className="text-3xl font-bold text-red-700 mt-2">{stats.derrotas}</div>
            <div className="text-xs text-slate-500 mt-1">
              {partidos.length > 0 ? `${((stats.derrotas / partidos.length) * 100).toFixed(0)}%` : '0%'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Diferencia Goles</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {stats.golesFavor - stats.golesContra > 0 ? '+' : ''}{stats.golesFavor - stats.golesContra}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stats.golesFavor} GF / {stats.golesContra} GC
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de partidos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-slate-900">Historial de Partidos</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Rival
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Localía
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Resultado
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Competición
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Estadísticas
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partidos.map((partido) => (
                <tr key={partido.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {formatFecha(partido.fecha)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900 font-medium">{partido.categoria}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-900">{partido.rival}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-slate-600">
                      {partido.esLocal ? 'Local' : 'Visitante'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-slate-900">
                        {partido.golesPropio} - {partido.golesRival}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getResultadoColor(partido.resultado)}`}>
                        {partido.resultado}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-slate-600">{partido.competicion}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-slate-600">
                      Alineaciones: {partido._count?.alineaciones || 0} |{' '}
                      Stats: {partido._count?.estadisticasIndividuales || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-3">
                      {partido.resultado === 'Por jugar' ? (
                        <button
                          onClick={() => navigate(`/partidos/${partido.id}/gestion`)}
                          className="text-green-700 hover:text-green-900 text-sm font-medium"
                        >
                          Iniciar Partido
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/partidos/${partido.id}/estadisticas`)}
                            className="text-blue-700 hover:text-blue-900 text-sm font-medium"
                          >
                            Estadísticas
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => navigate(`/partidos/${partido.id}`)}
                            className="text-slate-700 hover:text-slate-900 text-sm font-medium"
                          >
                            Ver Detalle
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {partidos.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">⚽</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No hay partidos registrados</h3>
              <p className="text-slate-500 mb-6">Comienza registrando tu primer partido</p>
              <button
                onClick={() => navigate('/partidos/nuevo')}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 font-medium"
              >
                Crear Primer Partido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartidosPage;
