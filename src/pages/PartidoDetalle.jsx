import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const PartidoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partido, setPartido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPartido();
  }, [id]);

  const cargarPartido = async () => {
    try {
      const response = await apiClient.get(`/partidos/${id}`);
      setPartido(response.data);
    } catch (error) {
      console.error('Error cargando partido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/partidos')}
            className="text-slate-600 hover:text-slate-900 mb-4"
          >
            ← Volver a Partidos
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {partido?.categoria} vs {partido?.rival}
            </h1>
            <p className="text-slate-600 text-lg">{partido?.competicion}</p>
            <p className="text-slate-500">{formatFecha(partido?.fecha)}</p>
          </div>

          {/* Resultado */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-slate-900 text-white px-8 py-4 rounded-lg">
              <span className="text-4xl font-bold">
                {partido?.golesPropio} - {partido?.golesRival}
              </span>
            </div>
            <div className={`mt-3 text-lg font-semibold ${
              partido?.resultado === 'Victoria' ? 'text-green-600' :
              partido?.resultado === 'Empate' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {partido?.resultado}
            </div>
          </div>

          {/* Información del Partido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Información del Partido</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Categoría:</span>
                  <span className="font-medium">{partido?.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Competición:</span>
                  <span className="font-medium">{partido?.competicion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Localía:</span>
                  <span className="font-medium">{partido?.esLocal ? 'Local' : 'Visitante'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ubicación:</span>
                  <span className="font-medium">{partido?.ubicacion || 'No especificada'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Goles a favor:</span>
                  <span className="font-medium">{partido?.golesPropio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Goles en contra:</span>
                  <span className="font-medium">{partido?.golesRival}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Diferencia:</span>
                  <span className={`font-medium ${
                    (partido?.golesPropio - partido?.golesRival) > 0 ? 'text-green-600' :
                    (partido?.golesPropio - partido?.golesRival) < 0 ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {partido?.golesPropio - partido?.golesRival > 0 ? '+' : ''}{partido?.golesPropio - partido?.golesRival}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-gray-200">
            {partido?.resultado === 'Por jugar' ? (
              <button
                onClick={() => navigate(`/partidos/${id}/gestion`)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Gestionar Partido
              </button>
            ) : (
              <button
                onClick={() => navigate(`/partidos/${id}/estadisticas`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Ver Análisis Completo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartidoDetalle;
