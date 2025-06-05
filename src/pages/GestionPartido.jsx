import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const GestionPartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partido, setPartido] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alineacion, setAlineacion] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tiempoPartido, setTiempoPartido] = useState({ minutos: 0, segundos: 0 });
  const [partidoIniciado, setPartidoIniciado] = useState(false);
  const [modalEvento, setModalEvento] = useState({ show: false, tipo: '', jugador: null });
  const [golesPropio, setGolesPropio] = useState(0);
  const [golesRival, setGolesRival] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  useEffect(() => {
    let interval;
    if (partidoIniciado) {
      interval = setInterval(() => {
        setTiempoPartido(prev => {
          let nuevosSegundos = prev.segundos + 1;
          let nuevosMinutos = prev.minutos;
          
          if (nuevosSegundos >= 60) {
            nuevosSegundos = 0;
            nuevosMinutos += 1;
          }
          
          return { minutos: nuevosMinutos, segundos: nuevosSegundos };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [partidoIniciado]);

  const cargarDatos = async () => {
    try {
      const [partidoRes, alumnosRes, alineacionRes, eventosRes] = await Promise.all([
        apiClient.get(`/partidos/${id}`),
        apiClient.get('/alumnos'),
        apiClient.get(`/partidos/${id}/alineacion`).catch(() => ({ data: [] })),
        apiClient.get(`/partidos/${id}/eventos`).catch(() => ({ data: [] }))
      ]);

      setPartido(partidoRes.data);
      setAlumnos(alumnosRes.data);
      setAlineacion(alineacionRes.data);
      setEventos(eventosRes.data);
      setGolesPropio(partidoRes.data.golesPropio || 0);
      setGolesRival(partidoRes.data.golesRival || 0);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarPartido = () => {
    setPartidoIniciado(true);
  };

  const pausarPartido = () => {
    setPartidoIniciado(false);
  };

  const registrarEvento = async (tipo, jugadorId = null, esEquipoPropio = true) => {
    try {
      const eventoData = {
        minuto: tiempoPartido.minutos,
        segundos: tiempoPartido.segundos,
        tipoEvento: tipo,
        jugadorPrincipal: jugadorId,
        esEquipoPropio
      };

      await apiClient.post(`/partidos/${id}/evento`, eventoData);
      
      // Actualizar goles si es necesario
      if (tipo === 'GOL') {
        if (esEquipoPropio) {
          setGolesPropio(prev => prev + 1);
        } else {
          setGolesRival(prev => prev + 1);
        }
      }
      
      cargarDatos();
      setModalEvento({ show: false, tipo: '', jugador: null });
    } catch (error) {
      console.error('Error registrando evento:', error);
    }
  };

  const finalizarPartido = async () => {
    try {
      let resultado = 'Empate';
      if (golesPropio > golesRival) resultado = 'Victoria';
      else if (golesPropio < golesRival) resultado = 'Derrota';

      await apiClient.put(`/partidos/${id}/resultado`, {
        golesPropio,
        golesRival,
        resultado
      });

      navigate('/partidos');
    } catch (error) {
      console.error('Error finalizando partido:', error);
    }
  };

  const tiposEventos = [
    { tipo: 'GOL', label: 'Gol', color: 'bg-green-500', emoji: '⚽' },
    { tipo: 'ASISTENCIA', label: 'Asistencia', color: 'bg-blue-500', emoji: '🎯' },
    { tipo: 'TARJETA_AMARILLA', label: 'Tarjeta Amarilla', color: 'bg-yellow-500', emoji: '🟨' },
    { tipo: 'TARJETA_ROJA', label: 'Tarjeta Roja', color: 'bg-red-500', emoji: '🟥' },
    { tipo: 'CAMBIO', label: 'Cambio', color: 'bg-purple-500', emoji: '��' },
    { tipo: 'LESION', label: 'Lesión', color: 'bg-orange-500', emoji: '🏥' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Fijo */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/partidos')}
                className="text-slate-600 hover:text-slate-900"
              >
                ← Volver
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Gestión en Vivo - {partido?.rival}
                </h1>
                <p className="text-slate-600 text-sm">{partido?.competicion}</p>
              </div>
            </div>
            
            {/* Marcador */}
            <div className="bg-slate-900 text-white px-6 py-3 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {golesPropio} - {golesRival}
                </div>
                <div className="text-sm opacity-75">
                  {String(tiempoPartido.minutos).padStart(2, '0')}:
                  {String(tiempoPartido.segundos).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Controles de Tiempo */}
            <div className="flex gap-3">
              {!partidoIniciado ? (
                <button
                  onClick={iniciarPartido}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Iniciar
                </button>
              ) : (
                <button
                  onClick={pausarPartido}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  Pausar
                </button>
              )}
              
              <button
                onClick={finalizarPartido}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel de Eventos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Eventos del Partido</h2>
              
              {/* Botones de Eventos Rápidos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {tiposEventos.map(evento => (
                  <button
                    key={evento.tipo}
                    onClick={() => setModalEvento({ show: true, tipo: evento.tipo, jugador: null })}
                    className={`${evento.color} text-white p-4 rounded-lg hover:opacity-90 flex flex-col items-center gap-2`}
                  >
                    <span className="text-2xl">{evento.emoji}</span>
                    <span className="text-sm font-medium">{evento.label}</span>
                  </button>
                ))}
              </div>

              {/* Línea de Tiempo de Eventos */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {eventos.map((evento, index) => (
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
                    <div className={`w-3 h-3 rounded-full ${evento.esEquipoPropio ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                  </div>
                ))}
                {eventos.length === 0 && (
                  <p className="text-slate-500 text-center py-8">No hay eventos registrados</p>
                )}
              </div>
            </div>
          </div>

          {/* Panel de Alineación */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Alineación</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alineacion.map((jugador, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">#{jugador.numeroCamiseta}</div>
                      <div className="text-sm text-slate-600">{jugador.posicion}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => registrarEvento('GOL', jugador.alumnoId)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ⚽
                      </button>
                      <button
                        onClick={() => registrarEvento('TARJETA_AMARILLA', jugador.alumnoId)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        🟨
                      </button>
                    </div>
                  </div>
                ))}
                {alineacion.length === 0 && (
                  <p className="text-slate-500 text-center py-8">No hay alineación registrada</p>
                )}
              </div>
            </div>

            {/* Panel de Estadísticas Rápidas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Estadísticas</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Goles a favor</span>
                  <span className="font-semibold">{golesPropio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Goles en contra</span>
                  <span className="font-semibold">{golesRival}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Eventos totales</span>
                  <span className="font-semibold">{eventos.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Eventos */}
      {modalEvento.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Registrar {modalEvento.tipo}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Jugador (opcional)
                </label>
                <select
                  value={modalEvento.jugador || ''}
                  onChange={(e) => setModalEvento(prev => ({ ...prev, jugador: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sin jugador específico</option>
                  {alineacion.map((jugador, index) => (
                    <option key={index} value={jugador.alumnoId}>
                      #{jugador.numeroCamiseta} - {jugador.posicion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Equipo
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => registrarEvento(modalEvento.tipo, modalEvento.jugador, true)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Nuestro Equipo
                  </button>
                  <button
                    onClick={() => registrarEvento(modalEvento.tipo, modalEvento.jugador, false)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Equipo Rival
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalEvento({ show: false, tipo: '', jugador: null })}
                className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPartido;
