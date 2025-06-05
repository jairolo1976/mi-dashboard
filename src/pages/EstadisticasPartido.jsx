import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import apiClient from '../services/apiClient';

const EstadisticasPartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partido, setPartido] = useState(null);
  const [estadisticas, setEstadisticas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('general');

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [partidoRes, statsRes, eventosRes] = await Promise.all([
        apiClient.get(`/partidos/${id}`),
        apiClient.get(`/partidos/${id}/estadisticas-individuales`).catch(() => ({ data: [] })),
        apiClient.get(`/partidos/${id}/eventos`).catch(() => ({ data: [] }))
      ]);

      setPartido(partidoRes.data);
      setEstadisticas(statsRes.data);
      setEventos(eventosRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Procesar datos para gráficos
  const procesarDatosRendimiento = () => {
    return estadisticas.map(stat => ({
      jugador: `#${stat.numeroCamiseta || 'N/A'}`,
      goles: stat.goles || 0,
      asistencias: stat.asistencias || 0,
      minutosJugados: stat.minutosJugados || 0,
      pases: stat.pases || 0,
      pasesCompletados: stat.pasesCompletados || 0,
      efectividad: stat.pases ? Math.round((stat.pasesCompletados / stat.pases) * 100) : 0
    }));
  };

  const procesarEventosPorTiempo = () => {
    const intervalos = Array.from({ length: 9 }, (_, i) => ({
      intervalo: `${i * 10}-${(i + 1) * 10}'`,
      eventos: 0,
      goles: 0
    }));

    eventos.forEach(evento => {
      const intervalo = Math.floor(evento.minuto / 10);
      if (intervalo < 9) {
        intervalos[intervalo].eventos++;
        if (evento.tipoEvento === 'GOL' && evento.esEquipoPropio) {
          intervalos[intervalo].goles++;
        }
      }
    });

    return intervalos;
  };

  const procesarEventosPorTipo = () => {
    const tiposEventos = {};
    eventos.forEach(evento => {
      if (evento.esEquipoPropio) {
        tiposEventos[evento.tipoEvento] = (tiposEventos[evento.tipoEvento] || 0) + 1;
      }
    });

    return Object.entries(tiposEventos).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      color: {
        'GOL': '#10B981',
        'ASISTENCIA': '#3B82F6',
        'TARJETA_AMARILLA': '#F59E0B',
        'TARJETA_ROJA': '#EF4444',
        'CAMBIO': '#8B5CF6',
        'LESION': '#F97316'
      }[tipo] || '#6B7280'
    }));
  };

  const calcularRendimientoEquipo = () => {
    const totalGoles = estadisticas.reduce((sum, stat) => sum + (stat.goles || 0), 0);
    const totalPases = estadisticas.reduce((sum, stat) => sum + (stat.pases || 0), 0);
    const totalPasesCompletados = estadisticas.reduce((sum, stat) => sum + (stat.pasesCompletados || 0), 0);
    const totalAsistencias = estadisticas.reduce((sum, stat) => sum + (stat.asistencias || 0), 0);

    return [
      {
        metrica: 'Efectividad de Pase',
        valor: totalPases ? Math.round((totalPasesCompletados / totalPases) * 100) : 0,
        maximo: 100
      },
      {
        metrica: 'Conversión de Goles',
        valor: Math.min(totalGoles * 10, 100),
        maximo: 100
      },
      {
        metrica: 'Asistencias',
        valor: Math.min(totalAsistencias * 15, 100),
        maximo: 100
      },
      {
        metrica: 'Intensidad',
        valor: Math.min(eventos.length * 5, 100),
        maximo: 100
      },
      {
        metrica: 'Disciplina',
        valor: Math.max(100 - (eventos.filter(e => e.tipoEvento.includes('TARJETA')).length * 20), 0),
        maximo: 100
      }
    ];
  };

  const COLORES_PIE = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  const datosRendimiento = procesarDatosRendimiento();
  const eventosTimeline = procesarEventosPorTiempo();
  const eventosPorTipo = procesarEventosPorTipo();
  const rendimientoEquipo = calcularRendimientoEquipo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/partidos')}
                className="text-slate-600 hover:text-slate-900"
              >
                ← Volver a Partidos
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Análisis Estadístico - {partido?.rival}
                </h1>
                <p className="text-slate-600">
                  {new Date(partido?.fecha).toLocaleDateString('es-ES')} • {partido?.competicion}
                </p>
              </div>
            </div>
            
            {/* Resultado Final */}
            <div className="bg-slate-900 text-white px-6 py-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {partido?.golesPropio} - {partido?.golesRival}
                </div>
                <div className={`text-sm mt-1 ${
                  partido?.resultado === 'Victoria' ? 'text-green-400' :
                  partido?.resultado === 'Empate' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {partido?.resultado}
                </div>
              </div>
            </div>
          </div>

          {/* Pestañas de Navegación */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'general', label: 'Vista General' },
              { key: 'jugadores', label: 'Rendimiento Individual' },
              { key: 'eventos', label: 'Análisis de Eventos' },
              { key: 'equipo', label: 'Métricas de Equipo' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setVistaActual(tab.key)}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  vistaActual === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Vista General */}
        {vistaActual === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métricas Clave */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Métricas Clave del Partido</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{partido?.golesPropio || 0}</div>
                  <div className="text-sm text-blue-600">Goles Anotados</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {estadisticas.reduce((sum, stat) => sum + (stat.asistencias || 0), 0)}
                  </div>
                  <div className="text-sm text-green-600">Asistencias</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {eventos.filter(e => e.tipoEvento === 'TARJETA_AMARILLA' && e.esEquipoPropio).length}
                  </div>
                  <div className="text-sm text-yellow-600">Tarjetas Amarillas</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {eventos.filter(e => e.tipoEvento === 'TARJETA_ROJA' && e.esEquipoPropio).length}
                  </div>
                  <div className="text-sm text-red-600">Tarjetas Rojas</div>
                </div>
              </div>
            </div>

            {/* Eventos por Tiempo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Intensidad por Intervalos</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={eventosTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="intervalo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="eventos" fill="#3B82F6" />
                  <Bar dataKey="goles" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Rendimiento Individual */}
        {vistaActual === 'jugadores' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Rendimiento por Jugador</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={datosRendimiento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jugador" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="goles" fill="#10B981" name="Goles" />
                  <Bar dataKey="asistencias" fill="#3B82F6" name="Asistencias" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla de Estadísticas Detallada */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Estadísticas Detalladas</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Jugador</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Minutos</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Goles</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Asistencias</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Pases</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Efectividad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {datosRendimiento.map((jugador, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{jugador.jugador}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{jugador.minutosJugados}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{jugador.goles}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{jugador.asistencias}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{jugador.pases}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            jugador.efectividad >= 80 ? 'bg-green-100 text-green-800' :
                            jugador.efectividad >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {jugador.efectividad}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Análisis de Eventos */}
        {vistaActual === 'eventos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribución de Eventos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventosPorTipo}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="cantidad"
                    label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                  >
                    {eventosPorTipo.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Cronología de Eventos</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {eventos.filter(e => e.esEquipoPropio).map((evento, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-mono bg-white px-2 py-1 rounded">
                      {evento.minuto}'
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{evento.tipoEvento}</span>
                      {evento.jugadorPrincipal && (
                        <span className="text-slate-600 ml-2">
                          - Jugador #{evento.jugadorPrincipal}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Métricas de Equipo */}
        {vistaActual === 'equipo' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Radar de Rendimiento del Equipo</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={rendimientoEquipo}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metrica" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Rendimiento"
                    dataKey="valor"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rendimientoEquipo.map((metrica, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">{metrica.metrica}</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${metrica.valor}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{metrica.valor}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadisticasPartido;
