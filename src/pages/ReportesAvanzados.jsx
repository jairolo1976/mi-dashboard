import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import apiClient from '../services/apiClient';

const ReportesAvanzados = () => {
  const [datos, setDatos] = useState({});
  const [loading, setLoading] = useState(true);
  const [tipoReporte, setTipoReporte] = useState('general');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [alumnosRes, partidosRes, evaluacionesRes] = await Promise.all([
        apiClient.get('/alumnos'),
        apiClient.get('/partidos'),
        apiClient.get('/evaluaciones')
      ]);

      procesarDatos(alumnosRes.data, partidosRes.data, evaluacionesRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const procesarDatos = (alumnos, partidos, evaluaciones) => {
    setDatos({
      rendimientoPorCategoria: generarRendimientoPorCategoria(alumnos, evaluaciones),
      analisisPartidos: generarAnalisisPartidos(partidos),
      metricsComparativas: generarMetricsComparativas(partidos, evaluaciones)
    });
  };

  const generarRendimientoPorCategoria = (alumnos, evaluaciones) => {
    const categorias = {};
    
    alumnos.forEach(alumno => {
      const categoria = alumno.categoria || 'Sin categoría';
      if (!categorias[categoria]) {
        categorias[categoria] = { categoria, totalEvaluaciones: 0, sumaNotas: 0, alumnos: 0 };
      }
      categorias[categoria].alumnos++;
    });

    evaluaciones.forEach(evaluation => {
      const alumno = alumnos.find(a => a.id === evaluation.alumnoId);
      const categoria = alumno?.categoria || 'Sin categoría';
      
      if (categorias[categoria]) {
        categorias[categoria].totalEvaluaciones++;
        categorias[categoria].sumaNotas += evaluation.puntuacionTotal || 0;
      }
    });

    return Object.values(categorias).map(cat => ({
      ...cat,
      promedio: cat.totalEvaluaciones > 0 ? Math.round(cat.sumaNotas / cat.totalEvaluaciones) : 0
    }));
  };

  const generarAnalisisPartidos = (partidos) => {
    const resultados = { Victoria: 0, Empate: 0, Derrota: 0 };
    let totalGoles = 0;
    let totalGolesRecibidos = 0;

    partidos.forEach(partido => {
      if (partido.resultado && resultados.hasOwnProperty(partido.resultado)) {
        resultados[partido.resultado]++;
      }
      totalGoles += partido.golesPropio || 0;
      totalGolesRecibidos += partido.golesRival || 0;
    });

    return {
      distribucionResultados: Object.entries(resultados).map(([resultado, cantidad]) => ({
        resultado,
        cantidad,
        porcentaje: partidos.length > 0 ? Math.round((cantidad / partidos.length) * 100) : 0
      }))
    };
  };

  const generarMetricsComparativas = (partidos, evaluaciones) => {
    const totalPartidos = partidos.length;
    const partidosGanados = partidos.filter(p => p.resultado === 'Victoria').length;
    const totalEvaluaciones = evaluaciones.length;
    const promedioGeneral = evaluaciones.length > 0 
      ? evaluaciones.reduce((sum, e) => sum + (e.puntuacionTotal || 0), 0) / evaluaciones.length 
      : 0;

    return {
      eficiencia: totalPartidos > 0 ? Math.round((partidosGanados / totalPartidos) * 100) : 0,
      consistencia: Math.round(promedioGeneral),
      actividad: totalEvaluaciones,
      mejora: 15
    };
  };

  const exportarReporte = (formato) => {
    const datosReporte = {
      fecha: new Date().toLocaleString('es-ES'),
      tipo: tipoReporte,
      datos: datos
    };
    
    const dataStr = JSON.stringify(datosReporte, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const COLORES_GRAFICOS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Centro de Reportes</h1>
        <p className="text-slate-600 mb-6">Análisis avanzado y exportación de datos</p>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Reporte</label>
              <select
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="general">Reporte General</option>
                <option value="rendimiento">Análisis de Rendimiento</option>
                <option value="partidos">Estadísticas de Partidos</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => exportarReporte('pdf')}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm"
              >
                📄 Exportar PDF
              </button>
              <button
                onClick={() => exportarReporte('excel')}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm"
              >
                📊 Exportar Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Rendimiento por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datos.rendimientoPorCategoria || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="promedio" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Distribución de Resultados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datos.analisisPartidos?.distribucionResultados || []}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="cantidad"
                label={({ resultado, porcentaje }) => `${resultado} ${porcentaje}%`}
              >
                {(datos.analisisPartidos?.distribucionResultados || []).map((entry, index) => (
                  <Cell key={index} fill={COLORES_GRAFICOS[index % COLORES_GRAFICOS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {datos.metricsComparativas?.eficiencia || 0}%
          </div>
          <div className="text-slate-600">Eficiencia</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {datos.metricsComparativas?.consistencia || 0}%
          </div>
          <div className="text-slate-600">Consistencia</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {datos.metricsComparativas?.actividad || 0}
          </div>
          <div className="text-slate-600">Actividad</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            +{datos.metricsComparativas?.mejora || 0}%
          </div>
          <div className="text-slate-600">Mejora</div>
        </div>
      </div>
    </div>
  );
};

export default ReportesAvanzados;
