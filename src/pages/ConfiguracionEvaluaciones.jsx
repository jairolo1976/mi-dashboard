import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Mail, 
  Calendar,
  Bell,
  Save,
  ArrowLeft,
  Info
} from 'lucide-react';

const ConfiguracionEvaluaciones = () => {
  const navigate = useNavigate();
  
  const [configuracion, setConfiguracion] = useState({
    // Frecuencia de evaluaciones
    frecuenciaFisica: 'mensual',
    frecuenciaTecnica: 'quincenal',
    frecuenciaActitudinal: 'mensual',
    
    // Notificaciones
    notificarPadres: true,
    notificarEntrenador: true,
    consolidarReportes: true,
    
    // Automatización
    envioAutomatico: true,
    diasRecordatorio: 3,
    horaEnvio: '18:00',
    
    // Plantilla de email
    asuntoEmail: 'Reporte de Evaluación - {nombre} {mes}',
    mensajeIntroduccion: 'Estimados padres de familia, adjunto encontrarán el reporte de evaluación de su hijo/a correspondiente al mes de {mes}.'
  });

  const handleGuardar = () => {
    // Aquí guardarías en el backend
    console.log('Configuración guardada:', configuracion);
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/evaluaciones')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} />
          Volver a Evaluaciones
        </button>
        
        <h1 className="text-2xl font-bold">Configuración de Evaluaciones</h1>
        <p className="text-gray-600">Configura la automatización y frecuencia de las evaluaciones</p>
      </div>

      {/* Frecuencia de Evaluaciones */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Frecuencia de Evaluaciones
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluación Física
            </label>
            <select
              value={configuracion.frecuenciaFisica}
              onChange={(e) => setConfiguracion({...configuracion, frecuenciaFisica: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="bimestral">Bimestral</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluación Técnica
            </label>
            <select
              value={configuracion.frecuenciaTecnica}
              onChange={(e) => setConfiguracion({...configuracion, frecuenciaTecnica: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="bimestral">Bimestral</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluación Actitudinal
            </label>
            <select
              value={configuracion.frecuenciaActitudinal}
              onChange={(e) => setConfiguracion({...configuracion, frecuenciaActitudinal: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="bimestral">Bimestral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Automatización */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mail size={20} />
          Automatización de Reportes
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={configuracion.envioAutomatico}
              onChange={(e) => setConfiguracion({...configuracion, envioAutomatico: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span>Enviar reportes automáticamente al completar evaluaciones</span>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={configuracion.consolidarReportes}
              onChange={(e) => setConfiguracion({...configuracion, consolidarReportes: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span>Consolidar las 3 evaluaciones en un solo reporte</span>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={configuracion.notificarPadres}
              onChange={(e) => setConfiguracion({...configuracion, notificarPadres: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span>Notificar a los padres por email</span>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={configuracion.notificarEntrenador}
              onChange={(e) => setConfiguracion({...configuracion, notificarEntrenador: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span>Enviar copia al entrenador</span>
          </label>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <Info className="inline w-4 h-4 mr-1" />
            Cuando está activado, el sistema enviará automáticamente los reportes a los emails registrados de los padres
          </p>
        </div>
      </div>

      {/* Recordatorios */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} />
          Recordatorios
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días antes para recordar evaluación
            </label>
            <input
              type="number"
              value={configuracion.diasRecordatorio}
              onChange={(e) => setConfiguracion({...configuracion, diasRecordatorio: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              min="1"
              max="7"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de envío de reportes
            </label>
            <input
              type="time"
              value={configuracion.horaEnvio}
              onChange={(e) => setConfiguracion({...configuracion, horaEnvio: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Plantilla de Email */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Plantilla de Email</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto del email
            </label>
            <input
              type="text"
              value={configuracion.asuntoEmail}
              onChange={(e) => setConfiguracion({...configuracion, asuntoEmail: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Variables disponibles: {'{nombre}'}, {'{mes}'}, {'{categoria}'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje de introducción
            </label>
            <textarea
              value={configuracion.mensajeIntroduccion}
              onChange={(e) => setConfiguracion({...configuracion, mensajeIntroduccion: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleGuardar}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save size={20} />
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionEvaluaciones;
