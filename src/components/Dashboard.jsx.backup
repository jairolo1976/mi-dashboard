import React, { useState, useEffect } from 'react';
import { Users, Calendar, AlertTriangle, Archive } from 'lucide-react';
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
      value: '45',
      bgColor: 'bg-purple-500',
      path: '/casilleros'
    }
  ];

  const handleCardClick = (path) => {
    console.log('🔄 Navegando a:', path);
    navigate(path);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Command Center</h1>
        <p className="text-gray-600">Sistema de Gestión CALYSM</p>
      </div>

      {/* Tarjetas principales - AHORA CLICKEABLES */}
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

      {/* Distribución por categorías */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Distribución por Categorías</h2>
        <div className="space-y-3">
          {categorias.map((categoria) => {
            const cantidad = estadisticas.porCategoria[categoria] || 0;
            const porcentaje = totalAlumnos > 0 ? (cantidad / totalAlumnos) * 100 : 0;
            
            return (
              <div key={categoria} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium">{categoria}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${porcentaje}%` }}
                  >
                    {porcentaje > 10 && (
                      <span className="text-white text-xs font-semibold">{cantidad}</span>
                    )}
                  </div>
                </div>
                <span className="w-16 text-right text-sm font-semibold">{cantidad}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">{totalAlumnos} alumnos</span>
          </div>
        </div>
      </div>

      {/* Panel de alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Alertas Recientes
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="font-semibold text-red-800">Urgente: Revisión médica</p>
              <p className="text-sm text-red-600">3 alumnos necesitan renovar certificado</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="font-semibold text-yellow-800">Pagos pendientes</p>
              <p className="text-sm text-yellow-600">5 cuotas por confirmar</p>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-semibold text-blue-800">Próximo evento</p>
              <p className="text-sm text-blue-600">Competencia regional - 15 de Junio</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/alertas')}
            className="mt-4 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Ver todas las alertas
          </button>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
        </div>
      </div>
    </div>
  );
}