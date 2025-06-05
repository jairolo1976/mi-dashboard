import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import apiClient from '../services/apiClient';

const DashboardPrincipal = () => {
  const [datos, setDatos] = useState({
    totalAlumnos: 0,
    totalPartidos: 0,
    totalEvaluaciones: 0,
    partidosGanados: 0,
    rendimientoMensual: [],
    evaluacionesPorMes: [],
    categoriasDistribucion: [],
    metricsGenerales: {}
  });
  const [loading, setLoading] = useState(true);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('6meses');

  useEffect(() => {
    cargarDatos();
  }, [periodoSeleccionado]);

  const cargarDatos = async () => {
    try {
      const [alumnosRes, partidosRes, evaluacionesRes] = await Promise.all([
        apiClient.get('/alumnos'),
        apiClient.get('/partidos'),
        apiClient.get('/evaluaciones')
      ]);

      const alumnos = alumnosRes.data;
      const partidos = partidosRes.data;
      const evaluaciones = evaluacionesRes.data;

      // Calcular métricas principales
      const partidosGanados = partidos.filter(p => p.resultado === 'Victoria').length;
      
      // Datos para gráficos
      const rendimientoMensual = generarRendimientoMensual(partidos);
      const evaluacionesPorMes = generarEvaluacionesPorMes(evaluaciones);
      const categoriasDistribucion = generarDistribucionCategorias(alumnos);
      
      // Métricas avanzadas
      const metricsGenerales = calcularMetricsGenerales(partidos, evaluaciones, alumnos);

      setDatos({
        totalAlumnos: alumnos.length,
        totalPartidos: partidos.length,
        totalEvaluaciones: evaluaciones.length,
        partidosGanados,
        rendimientoMensual,
        evaluacionesPorMes,
        categoriasDistribucion,
        metricsGenerales
      });
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarRendimientoMensual = (partidos) => {
    const meses = {};
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 6);

    for (let i = 0; i < 6; i++) {
      const fecha = new Date(fechaInicio);
      fecha.setMonth(fecha.getMonth() + i);
      const key = fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      meses[key] = { mes: key, victorias: 0, empates: 0, derrotas: 0, total: 0 };
    }

    partidos.forEach(partido => {
      const fechaPartido = new Date(partido.fecha);
      const key = fechaPartido.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      
      if (meses[key]) {
        meses[key].total++;
        if (partido.resultado === 'Victoria') meses[key].victorias++;
        else if (partido.resultado === 'Empate') meses[key].empates++;
        else if (partido.resultado === 'Derrota') meses[key].derrotas++;
      }
    });

    return Object.values(meses);
  };

  const generarEvaluacionesPorMes = (evaluaciones) => {
    const meses = {};
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 6);

    for (let i = 0; i < 6; i++) {
      const fecha = new Date(fechaInicio);
      fecha.setMonth(fecha.getMonth() + i);
      const key = fecha.toLocaleDateString('es-ES', { month: 'short' });
      meses[key] = { mes: key, evaluaciones: 0, promedio: 0 };
    }

    evaluaciones.forEach(evaluacion => {
      const fechaEval = new Date(evaluacion.fechaEvaluacion);
      const key = fechaEval.toLocaleDateString('es-ES', { month: 'short' });
      
      if (meses[key]) {
        meses[key].evaluaciones++;
        meses[key].promedio += evaluacion.puntuacionTotal || 0;
      }
    });

    Object.values(meses).forEach(mes => {
      if (mes.evaluaciones > 0) {
        mes.promedio = Math.round(mes.promedio / mes.evaluaciones);
      }
    });

    return Object.values(meses);
  };

  const generarDistribucionCategorias = (alumnos) => {
    const categorias = {};
    alumnos.forEach(alumno => {
      const cat = alumno.categoria || 'Sin categoría';
      categorias[cat] = (categorias[cat] || 0) + 1;
    });

    const colores = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];
    return Object.entries(categorias).map(([categoria, cantidad], index) => ({
      categoria,
      cantidad,
      color: colores[index % colores.length]
    }));
  };

  const calcularMetricsGenerales = (partidos, evaluaciones, alumnos) => {
    const totalGoles = partidos.reduce((sum, p) => sum + (p.golesPropio || 0), 0);
    const promedioEvaluaciones = evaluaciones.length > 0 
      ? evaluaciones.reduce((sum, e) => sum + (e.puntuacionTotal || 0), 0) / evaluaciones.length 
      : 0;
    
    const alumnosActivos = alumnos.filter(a => a.activo).length;
    const tasaVictorias = partidos.length > 0 ? (datos.partidosGanados / partidos.length) * 100 : 0;

    return {
      totalGoles,
      promedioEvaluaciones: Math.round(promedioEvaluaciones),
      alumnosActivos,
      tasaVictorias: Math.round(tasaVictorias)
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Centro de Control</h1>
            <p className="text-slate-600 mt-2">Métricas y análisis ejecutivo del rendimiento deportivo</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="3meses">Últimos 3 meses</option>
              <option value="6meses">Últimos 6 meses</option>
              <option value="1año">Último año</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Alumnos</p>
              <p className="text-3xl font-bold">{datos.totalAlumnos}</p>
              <p className="text-blue-100 text-sm">{datos.metricsGenerales.alumnosActivos} activos</p>
            </div>
            <div className="text-4xl opacity-20">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Partidos Jugados</p>
              <p className="text-3xl font-bold">{datos.totalPartidos}</p>
              <p className="text-green-100 text-sm">{datos.partidosGanados} victorias</p>
            </div>
            <div className="text-4xl opacity-20">⚽</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Evaluaciones</p>
              <p className="text-3xl font-bold">{datos.totalEvaluaciones}</p>
              <p className="text-purple-100 text-sm">Promedio: {datos.metricsGenerales.promedioEvaluaciones}%</p>
            </div>
            <div className="text-4xl opacity-20">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Tasa de Victoria</p>
              <p className="text-3xl font-bold">{datos.metricsGenerales.tasaVictorias}%</p>
              <p className="text-yellow-100 text-sm">{datos.metricsGenerales.totalGoles} goles totales</p>
            </div>
            <div className="text-4xl opacity-20">🏆</div>
          </div>
        </div>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Rendimiento Mensual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Rendimiento Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datos.rendimientoMensual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="victorias" stackId="1" stroke="#10B981" fill="#10B981" />
              <Area type="monotone" dataKey="empates" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
              <Area type="monotone" dataKey="derrotas" stackId="1" stroke="#EF4444" fill="#EF4444" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Evolución de Evaluaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Evolución de Evaluaciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datos.evaluacionesPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="evaluaciones" fill="#3B82F6" />
              <Line yAxisId="right" type="monotone" dataKey="promedio" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribución y Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribución por Categorías */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Distribución por Categorías</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={datos.categoriasDistribucion}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="cantidad"
                label={({ categoria, cantidad }) => `${categoria}: ${cantidad}`}
              >
                {datos.categoriasDistribucion.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas de Rendimiento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Indicadores Clave</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Eficiencia Ofensiva</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-semibold">75%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Consistencia</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="text-sm font-semibold">82%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Progreso General</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-sm font-semibold">68%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">
              📊 Generar Reporte
            </button>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium">
              ⚽ Nuevo Partido
            </button>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-medium">
              📝 Evaluación Grupal
            </button>
            <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-medium">
              👥 Gestionar Alumnos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPrincipal;
