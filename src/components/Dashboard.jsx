import React, { useState, useEffect } from 'react';
import { Users, Calendar, AlertTriangle, Archive, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    porCategoria: {
      'Benjamín': 0,
      'Alevín': 0,
      'Infantil': 0,
      'Cadete': 0,
      'Juvenil': 0,
      'Senior': 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        console.log('🔄 Cargando estadísticas...');
        const response = await apiClient.get('/alumnos/estadisticas');
        console.log('✅ Estadísticas recibidas:', response.data);
        setEstadisticas(response.data);
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  const categorias = ['Benjamín', 'Alevín', 'Infantil', 'Cadete', 'Juvenil', 'Senior'];
  const totalAlumnos = estadisticas.total || 0;

  const cardData = [
    {
      icon: Users,
      title: 'Total Alumnos',
      value: loading ? '...' : totalAlumnos.toString(),
      bgColor: 'bg-blue-500',
      path: '/alumnos'
    },
    {
      icon: Calendar,
      title: 'Eventos Activos',
      value: '12',
      bgColor: 'bg-green-500',
      path: '/agenda'
    },
    {
      icon: AlertTriangle,
      title: 'Alertas',
      value: '4',
      bgColor: 'bg-yellow-500',
      path: '/alertas'
    },
    {
      icon: Archive,
      title: 'Casilleros',
      value: '85',
      bgColor: 'bg-purple-500',
      path: '/casilleros'
    }
  ];

  const handleCardClick = (path) => {
    console.log('🔄 Navegando a:', path);
    navigate(path);
  };

  // Nueva función para navegar a alumnos con filtro por categoría
  const handleCategoriaClick = (categoria) => {
    console.log('🔄 Navegando a alumnos filtrado por:', categoria);
    navigate('/alumnos', { state: { filtroCategoria: categoria } });
  };

  // Función para navegar a reportes de una categoría específica
  const handleReportesCategoria = (categoria) => {
    console.log('📊 Navegando a reportes de:', categoria);
    navigate('/alumnos', { state: { filtroCategoria: categoria, mostrarReportes: true } });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Command Center</h1>
        <p className="text-gray-600">Sistema de Gestión CALYSM</p>
      </div>

      {/* Tarjetas principales - CLICKEABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card.path)}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-800">{card.value}</span>
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-2">Click para ver detalles</p>
          </div>
        ))}
      </div>

      {/* Distribución por categorías - AHORA CLICKEABLES */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Distribución por Categorías</h2>
        <div className="space-y-3">
          {categorias.map((categoria) => {
            const cantidad = estadisticas.porCategoria[categoria] || 0;
            const porcentaje = totalAlumnos > 0 ? (cantidad / totalAlumnos) * 100 : 0;
            
            // Colores dinámicos por categoría
            const getColorCategoria = (cat) => {
              const colores = {
                'Benjamín': 'bg-blue-500',
                'Alevín': 'bg-green-500',
                'Infantil': 'bg-yellow-500',
                'Cadete': 'bg-purple-500',
                'Juvenil': 'bg-red-500',
                'Senior': 'bg-gray-500'
              };
              return colores[cat] || 'bg-gray-500';
            };

            return (
              <div 
                key={categoria} 
                className="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span 
                      className={`inline-block w-4 h-4 rounded-full ${getColorCategoria(categoria)}`}
                    ></span>
                    <span className="font-medium text-gray-700">{categoria}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-800">{cantidad}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoriaClick(categoria);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                        title={`Ver alumnos de ${categoria}`}
                      >
                        Ver Lista
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReportesCategoria(categoria);
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                        title={`Ver reportes de ${categoria}`}
                      >
                        Reportes
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getColorCategoria(categoria)}`}
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {porcentaje.toFixed(1)}% del total
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel de acciones rápidas - CON REPORTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/alumnos')}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex flex-col items-center gap-2"
            >
              <Users className="w-8 h-8" />
              <span className="text-sm">Nuevo Alumno</span>
            </button>
            <button 
              onClick={() => navigate('/agenda')}
              className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex flex-col items-center gap-2"
            >
              <Calendar className="w-8 h-8" />
              <span className="text-sm">Crear Evento</span>
            </button>
            <button 
              onClick={() => navigate('/alertas')}
              className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex flex-col items-center gap-2"
            >
              <AlertTriangle className="w-8 h-8" />
              <span className="text-sm">Nueva Alerta</span>
            </button>
            <button 
              onClick={() => navigate('/casilleros')}
              className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex flex-col items-center gap-2"
            >
              <Archive className="w-8 h-8" />
              <span className="text-sm">Asignar Casillero</span>
            </button>
            {/* NUEVO: Botón de reportes */}
            <button 
              onClick={() => navigate('/alumnos', { state: { mostrarReportes: true } })}
              className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex flex-col items-center gap-2"
            >
              <FileText className="w-8 h-8" />
              <span className="text-sm">Ver Reportes</span>
            </button>
            <button 
              onClick={() => navigate('/alumnos')}
              className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex flex-col items-center gap-2"
            >
              <Users className="w-8 h-8" />
              <span className="text-sm">Gestionar Alumnos</span>
            </button>
          </div>
        </div>

        {/* Panel de resumen de evaluaciones */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Resumen de Evaluaciones</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Evaluaciones Completadas</span>
              <span className="text-green-600 font-bold">{Math.round(totalAlumnos * 0.85)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Pendientes de Evaluación</span>
              <span className="text-yellow-600 font-bold">{Math.round(totalAlumnos * 0.15)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Reportes Generados (Mes)</span>
              <span className="text-blue-600 font-bold">{Math.round(totalAlumnos * 0.6)}</span>
            </div>
            <button
              onClick={() => navigate('/alumnos', { state: { mostrarEvaluaciones: true } })}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Gestionar Evaluaciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}