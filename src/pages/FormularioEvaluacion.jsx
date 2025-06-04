import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Timer, 
  Target, 
  Heart,
  TrendingUp,
  Activity,
  Users,
  Info,
  CheckCircle,
  AlertCircle,
  Mail,
  X
} from 'lucide-react';
import apiClient from '../services/apiClient';

const FormularioEvaluacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jugador, setJugador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [tipoEvaluacion, setTipoEvaluacion] = useState('fisica');
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarModalEmail, setMostrarModalEmail] = useState(false);
  const [evaluacionesCompletadas, setEvaluacionesCompletadas] = useState({
    fisica: false,
    tecnica: false,
    actitudinal: false
  });
  
  // Estado para evaluación física
  const [evaluacionFisica, setEvaluacionFisica] = useState({
    velocidad40m: '',
    saltoLongitud: '',
    testCooper: '',
    flexibilidad: '',
    fuerza: '',
    resistencia: ''
  });

  // Estado para evaluación técnica
  const [evaluacionTecnica, setEvaluacionTecnica] = useState({
    controlBalon: 3,
    pase: 3,
    tiro: 3,
    regate: 3,
    cabeceo: 3,
    visionJuego: 3,
    golesPartido: 0,
    asistencias: 0,
    minutosJugados: 0
  });

  // Estado para evaluación actitudinal
  const [evaluacionActitudinal, setEvaluacionActitudinal] = useState({
    puntualidad: 3,
    respeto: 3,
    trabajoEquipo: 3,
    liderazgo: 3,
    esfuerzo: 3,
    actitudPositiva: 3,
    observaciones: ''
  });

  useEffect(() => {
    cargarJugador();
  }, [id]);

  const cargarJugador = async () => {
    try {
      const response = await apiClient.get(`/alumnos/${id}`);
      setJugador(response.data);
    } catch (error) {
      console.error('Error al cargar jugador:', error);
    } finally {
      setLoading(false);
    }
  };

  // Referencias por categoría y edad
  const getReferenciasPorCategoria = (categoria) => {
    const referencias = {
      'Benjamín': {
        velocidad40m: { min: 7.5, max: 9.0, ideal: 8.0 },
        saltoLongitud: { min: 1.20, max: 1.60, ideal: 1.40 },
        testCooper: { min: 1800, max: 2400, ideal: 2100 },
        descripcion: '8-10 años'
      },
      'Alevín': {
        velocidad40m: { min: 6.8, max: 8.2, ideal: 7.5 },
        saltoLongitud: { min: 1.40, max: 1.80, ideal: 1.60 },
        testCooper: { min: 2100, max: 2700, ideal: 2400 },
        descripcion: '10-12 años'
      },
      'Infantil': {
        velocidad40m: { min: 6.2, max: 7.5, ideal: 6.8 },
        saltoLongitud: { min: 1.60, max: 2.10, ideal: 1.85 },
        testCooper: { min: 2400, max: 3000, ideal: 2700 },
        descripcion: '12-14 años'
      },
      'Cadete': {
        velocidad40m: { min: 5.8, max: 7.0, ideal: 6.4 },
        saltoLongitud: { min: 1.80, max: 2.30, ideal: 2.05 },
        testCooper: { min: 2600, max: 3200, ideal: 2900 },
        descripcion: '14-16 años'
      },
      'Juvenil': {
        velocidad40m: { min: 5.5, max: 6.5, ideal: 6.0 },
        saltoLongitud: { min: 2.00, max: 2.50, ideal: 2.25 },
        testCooper: { min: 2800, max: 3400, ideal: 3100 },
        descripcion: '16-18 años'
      }
    };
    return referencias[categoria] || referencias['Infantil'];
  };

  const referencias = getReferenciasPorCategoria(jugador?.categoria);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      let endpoint = '';
      let datos = {};
      
      switch (tipoEvaluacion) {
        case 'fisica':
          endpoint = `/evaluaciones/fisica/${id}`;
          datos = evaluacionFisica;
          break;
        case 'tecnica':
          endpoint = `/evaluaciones/tecnica/${id}`;
          datos = evaluacionTecnica;
          break;
        case 'actitudinal':
          endpoint = `/evaluaciones/actitudinal/${id}`;
          datos = evaluacionActitudinal;
          break;
      }
      
      // Enviar al backend real
      const response = await apiClient.post(endpoint, datos);
      
      if (response.data.success) {
        // Marcar como completada
        const nuevasCompletadas = {
          ...evaluacionesCompletadas,
          [tipoEvaluacion]: true
        };
        
        setEvaluacionesCompletadas(nuevasCompletadas);
        
        // Mostrar mensaje de éxito
        setMostrarExito(true);
        setTimeout(() => setMostrarExito(false), 3000);
        
        // Si todas las evaluaciones están completas, mostrar modal de confirmación de email
        if (nuevasCompletadas.fisica && nuevasCompletadas.tecnica && nuevasCompletadas.actitudinal) {
          setMostrarModalEmail(true);
        } else {
          // Cambiar a la siguiente evaluación automáticamente
          if (tipoEvaluacion === 'fisica') {
            setTipoEvaluacion('tecnica');
          } else if (tipoEvaluacion === 'tecnica') {
            setTipoEvaluacion('actitudinal');
          }
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la evaluación');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEnvioEmail = async () => {
    try {
      const response = await apiClient.post(`/evaluaciones/enviar-reporte/${id}`);
      if (response.data.success) {
        setMostrarModalEmail(false);
        alert('¡Reporte enviado exitosamente a los padres!');
        navigate('/evaluaciones');
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      alert('Error al enviar el reporte por email');
    }
  };

  const cancelarEnvioEmail = () => {
    setMostrarModalEmail(false);
    alert('Evaluaciones completadas. Puedes enviar el reporte más tarde desde la página de evaluaciones.');
    navigate('/evaluaciones');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Modal de confirmación de email */}
      {mostrarModalEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">¡Evaluaciones Completadas!</h2>
              <button
                onClick={cancelarEnvioEmail}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Has completado las 3 evaluaciones de <strong>{jugador?.nombre} {jugador?.apellido}</strong>.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Se enviará el reporte a:
                </h3>
                <div className="space-y-1 text-sm text-blue-800">
                  {jugador?.emailTutor && (
                    <div>📧 Padre/Madre: {jugador.emailTutor}</div>
                  )}
                  {jugador?.emailTutor2 && (
                    <div>📧 Segundo tutor: {jugador.emailTutor2}</div>
                  )}
                  {!jugador?.emailTutor && !jugador?.emailTutor2 && (
                    <div className="text-yellow-600">⚠️ No hay emails registrados para este jugador</div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                ¿Deseas enviar automáticamente el reporte consolidado por email?
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={cancelarEnvioEmail}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Enviar más tarde
              </button>
              <button
                onClick={confirmarEnvioEmail}
                disabled={!jugador?.emailTutor && !jugador?.emailTutor2}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Enviar ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/evaluaciones')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} />
          Volver a Evaluaciones
        </button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-2">
            Evaluación de {jugador?.nombre} {jugador?.apellido}
          </h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>#{jugador?.numeroCamiseta || '?'}</span>
            <span>•</span>
            <span>{jugador?.posicion || 'Sin posición'}</span>
            <span>•</span>
            <span>{jugador?.categoria}</span>
            <span>•</span>
            <span>{jugador?.edad} años</span>
          </div>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {mostrarExito && (
        <div className="mb-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          <span>Evaluación guardada exitosamente</span>
        </div>
      )}

      {/* Selector de tipo de evaluación con indicadores */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setTipoEvaluacion('fisica')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all relative ${
              tipoEvaluacion === 'fisica'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Activity className="inline-block w-5 h-5 mr-2" />
            Evaluación Física
            {evaluacionesCompletadas.fisica && (
              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-300" />
            )}
          </button>
          <button
            onClick={() => setTipoEvaluacion('tecnica')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all relative ${
              tipoEvaluacion === 'tecnica'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Target className="inline-block w-5 h-5 mr-2" />
            Evaluación Técnica
            {evaluacionesCompletadas.tecnica && (
              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-300" />
            )}
          </button>
          <button
            onClick={() => setTipoEvaluacion('actitudinal')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all relative ${
              tipoEvaluacion === 'actitudinal'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className="inline-block w-5 h-5 mr-2" />
            Evaluación Actitudinal
            {evaluacionesCompletadas.actitudinal && (
              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-300" />
            )}
          </button>
        </div>
      </div>

      {/* Formulario según tipo */}
      <div className="bg-white rounded-lg shadow p-6">
        {tipoEvaluacion === 'fisica' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-600">Pruebas Físicas</h2>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-700">
                  Valores de referencia para {jugador?.categoria} ({referencias.descripcion})
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Timer className="inline w-4 h-4 mr-1" />
                  Velocidad 40m (segundos)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={evaluacionFisica.velocidad40m}
                    onChange={(e) => setEvaluacionFisica({...evaluacionFisica, velocidad40m: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 5.8"
                  />
                  <div className="mt-1 text-xs text-gray-600">
                    <Info className="inline w-3 h-3 mr-1" />
                    Ideal: {referencias.velocidad40m.ideal}s | Rango: {referencias.velocidad40m.max}-{referencias.velocidad40m.min}s
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="inline w-4 h-4 mr-1" />
                  Salto Longitud (metros)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={evaluacionFisica.saltoLongitud}
                    onChange={(e) => setEvaluacionFisica({...evaluacionFisica, saltoLongitud: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 2.10"
                  />
                  <div className="mt-1 text-xs text-gray-600">
                    <Info className="inline w-3 h-3 mr-1" />
                    Ideal: {referencias.saltoLongitud.ideal}m | Rango: {referencias.saltoLongitud.min}-{referencias.saltoLongitud.max}m
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="inline w-4 h-4 mr-1" />
                  Test Cooper (metros)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={evaluacionFisica.testCooper}
                    onChange={(e) => setEvaluacionFisica({...evaluacionFisica, testCooper: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 2800"
                  />
                  <div className="mt-1 text-xs text-gray-600">
                    <Info className="inline w-3 h-3 mr-1" />
                    Ideal: {referencias.testCooper.ideal}m | Rango: {referencias.testCooper.min}-{referencias.testCooper.max}m
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flexibilidad (cm)
                </label>
                <input
                  type="number"
                  value={evaluacionFisica.flexibilidad}
                  onChange={(e) => setEvaluacionFisica({...evaluacionFisica, flexibilidad: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 15"
                />
                <div className="mt-1 text-xs text-gray-600">
                  <Info className="inline w-3 h-3 mr-1" />
                  Prueba sit-and-reach: Mayor valor = mejor flexibilidad
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuerza (repeticiones)
                </label>
                <input
                  type="number"
                  value={evaluacionFisica.fuerza}
                  onChange={(e) => setEvaluacionFisica({...evaluacionFisica, fuerza: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 25"
                />
                <div className="mt-1 text-xs text-gray-600">
                  <Info className="inline w-3 h-3 mr-1" />
                  Flexiones o abdominales en 1 minuto
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resistencia (minutos)
                </label>
                <input
                  type="number"
                  value={evaluacionFisica.resistencia}
                  onChange={(e) => setEvaluacionFisica({...evaluacionFisica, resistencia: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 12"
                />
                <div className="mt-1 text-xs text-gray-600">
                  <Info className="inline w-3 h-3 mr-1" />
                  Tiempo continuo de carrera a ritmo moderado
                </div>
              </div>
            </div>
          </div>
        )}

        {tipoEvaluacion === 'tecnica' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 text-green-600">Habilidades Técnicas</h2>
            
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-800">
                <Info className="inline w-4 h-4 mr-1" />
                Evalúa cada habilidad del 1 al 5, donde 1 es muy bajo y 5 es excelente para su categoría
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries({
                controlBalon: 'Control de Balón',
                pase: 'Pase',
                tiro: 'Tiro',
                regate: 'Regate',
                cabeceo: 'Cabeceo',
                visionJuego: 'Visión de Juego'
              }).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <button
                        key={valor}
                        onClick={() => setEvaluacionTecnica({...evaluacionTecnica, [key]: valor})}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          evaluacionTecnica[key] === valor
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Estadísticas del Último Partido</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goles
                  </label>
                  <input
                    type="number"
                    value={evaluacionTecnica.golesPartido}
                    onChange={(e) => setEvaluacionTecnica({...evaluacionTecnica, golesPartido: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asistencias
                  </label>
                  <input
                    type="number"
                    value={evaluacionTecnica.asistencias}
                    onChange={(e) => setEvaluacionTecnica({...evaluacionTecnica, asistencias: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minutos Jugados
                  </label>
                  <input
                    type="number"
                    value={evaluacionTecnica.minutosJugados}
                    onChange={(e) => setEvaluacionTecnica({...evaluacionTecnica, minutosJugados: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    min="0"
                    max="90"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tipoEvaluacion === 'actitudinal' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 text-purple-600">Evaluación Actitudinal</h2>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-purple-800">
                <Info className="inline w-4 h-4 mr-1" />
                Evalúa el comportamiento y actitud del jugador en entrenamientos y partidos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries({
                puntualidad: 'Puntualidad',
                respeto: 'Respeto',
                trabajoEquipo: 'Trabajo en Equipo',
                liderazgo: 'Liderazgo',
                esfuerzo: 'Esfuerzo',
                actitudPositiva: 'Actitud Positiva'
              }).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <button
                        key={valor}
                        onClick={() => setEvaluacionActitudinal({...evaluacionActitudinal, [key]: valor})}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          evaluacionActitudinal[key] === valor
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    1 = Muy bajo | 3 = Normal | 5 = Excelente
                  </p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={evaluacionActitudinal.observaciones}
                onChange={(e) => setEvaluacionActitudinal({...evaluacionActitudinal, observaciones: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Comentarios adicionales sobre el comportamiento del jugador..."
              />
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div className="text-sm text-gray-600">
            Evaluaciones completadas: {Object.values(evaluacionesCompletadas).filter(v => v).length} de 3
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/evaluaciones')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Salir
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={20} />
              {guardando ? 'Guardando...' : 'Guardar y Continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioEvaluacion;
