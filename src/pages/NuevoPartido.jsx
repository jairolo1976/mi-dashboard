import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const NuevoPartido = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    categoria: '',
    rival: '',
    competicion: '',
    esLocal: true,
    ubicacion: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    try {
      const response = await apiClient.get('/alumnos');
      setAlumnos(response.data);
    } catch (error) {
      console.error('Error cargando alumnos:', error);
    }
  };

  const categorias = [
    'Prebenjamín',
    'Benjamín', 
    'Alevín',
    'Infantil',
    'Cadete',
    'Juvenil',
    'Senior',
    'Veteranos'
  ];

  const competiciones = [
    'Liga Regular',
    'Copa Local',
    'Torneo Regional',
    'Amistoso',
    'Copa Federación',
    'Playoff',
    'Supercopa',
    'Champions Local'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.hora) newErrors.hora = 'La hora es requerida';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
    if (!formData.rival) newErrors.rival = 'El equipo rival es requerido';
    if (!formData.competicion) newErrors.competicion = 'La competición es requerida';
    if (!formData.ubicacion) newErrors.ubicacion = 'La ubicación es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const fechaCompleta = new Date(`${formData.fecha}T${formData.hora}`);
      
      const partidoData = {
        fecha: fechaCompleta.toISOString(),
        categoria: formData.categoria,
        rival: formData.rival,
        competicion: formData.competicion,
        esLocal: formData.esLocal,
        ubicacion: formData.ubicacion,
        resultado: 'Por jugar',
        golesPropio: 0,
        golesRival: 0
      };

      await apiClient.post('/partidos', partidoData);
      navigate('/partidos');
    } catch (error) {
      console.error('Error creando partido:', error);
      alert('Error al crear el partido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/partidos')}
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Volver a Partidos
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900">Programar Nuevo Partido</h1>
          <p className="text-slate-600 mt-2">Complete la información del partido a programar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Información Básica */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información del Partido</h3>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha del Partido *
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleChange('fecha', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fecha ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hora del Partido *
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => handleChange('hora', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.hora ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.hora && <p className="text-red-500 text-sm mt-1">{errors.hora}</p>}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.categoria ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
              </div>

              {/* Equipo Rival */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Equipo Rival *
                </label>
                <input
                  type="text"
                  value={formData.rival}
                  onChange={(e) => handleChange('rival', e.target.value)}
                  placeholder="Ej: FC Barcelona, Real Madrid CF"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.rival ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.rival && <p className="text-red-500 text-sm mt-1">{errors.rival}</p>}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Detalles del Encuentro</h3>
              </div>

              {/* Competición */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Competición *
                </label>
                <select
                  value={formData.competicion}
                  onChange={(e) => handleChange('competicion', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.competicion ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar competición</option>
                  {competiciones.map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
                {errors.competicion && <p className="text-red-500 text-sm mt-1">{errors.competicion}</p>}
              </div>

              {/* Localía */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Condición del Partido
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange('esLocal', true)}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      formData.esLocal 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Local</div>
                    <div className="text-sm text-gray-600">En casa</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('esLocal', false)}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      !formData.esLocal 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Visitante</div>
                    <div className="text-sm text-gray-600">Fuera de casa</div>
                  </button>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => handleChange('ubicacion', e.target.value)}
                  placeholder="Ej: Estadio Municipal, Campo de Fútbol San José"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ubicacion ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.ubicacion && <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>}
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• El partido se creará con estado "Por jugar"</li>
                  <li>• Podrás gestionar alineaciones y estadísticas después</li>
                  <li>• Los resultados se actualizarán durante el partido</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/partidos')}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Creando Partido...' : 'Crear Partido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoPartido;
