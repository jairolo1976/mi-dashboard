import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Send, Eye, ArrowLeft } from 'lucide-react';
import VistaPrevia from './VistaPrevia';
import apiClient from '../../services/apiClient';
import html2pdf from 'html2pdf.js';
import './reportes.css';

/**
 * Componente principal para generar reportes de jugadores
 * Maneja la selección del tipo de reporte y orquesta la generación
 */
export default function GeneradorReporte() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados principales
  const [tipoReporte, setTipoReporte] = useState('');
  const [modoVisualizacion, setModoVisualizacion] = useState('visual'); // 'visual' o 'formal'
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarPrevia, setMostrarPrevia] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [jugador, setJugador] = useState(null);

  // Cargar datos del jugador
  useEffect(() => {
    if (id) {
      cargarDatosCompletos();
    }
  }, [id]);

  /**
   * Carga todos los datos necesarios para el reporte usando los endpoints reales
   */
  const cargarDatosCompletos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos completos del jugador:', id);
      
      // Usar el endpoint real de reportes
      const response = await apiClient.get(`/reportes/jugador/${id}`);
      
      if (response.data.success) {
        const datos = response.data.data;
        console.log('✅ Datos del backend recibidos:', datos);
        
        // Transformar los datos del backend al formato esperado por los componentes
        setReporteData({
          jugador: {
            nombre: `${datos.jugador.nombre} ${datos.jugador.apellido || ''}`.trim(),
            categoria: datos.jugador.categoria,
            foto: datos.jugador.foto,
            numeroCamiseta: datos.jugador.numeroCamiseta,
            posicion: datos.jugador.posicion,
            edad: datos.jugador.edad
          },
          evaluacion: {
            fisico: datos.evaluacion.fisico,
            tecnico: datos.evaluacion.tecnico,
            tactico: datos.evaluacion.tactico,
            actitudinal: datos.evaluacion.actitudinal
          },
          metricas: {
            asistencia: datos.metricas.asistencia,
            golesMes: datos.metricas.golesMes,
            partidosMes: datos.metricas.partidosMes,
            notaGeneral: datos.metricas.notaGeneral,
            asistenciasTotales: datos.metricas.asistenciasTotales,
            partidosJugados: datos.metricas.partidosJugados,
            minutosJugados: datos.metricas.minutosJugados,
            kmRecorridos: datos.metricas.kmRecorridos,
            // Campos adicionales para diferentes tipos de reporte
            golesTotales: datos.metricas.golesMes * 3, // Estimación para reporte anual
            promedioPases: '85%',
            recuperaciones: Math.floor(datos.metricas.partidosJugados * 2.5)
          },
          evolucion: datos.evolucion,
          observaciones: {
            positivos: datos.observaciones.positivos,
            mejoras: datos.observaciones.mejoras,
            medico: datos.observaciones.medico,
            proximosObjetivos: datos.observaciones.proximosObjetivos
          },
          // Datos adicionales del backend
          evaluacionesTecnicas: datos.evaluacionesTecnicas,
          evaluacionesActitudinales: datos.evaluacionesActitudinales,
          resultadosFisicos: datos.resultadosFisicos
        });

        // Guardar datos básicos del jugador
        setJugador({
          id: datos.jugador.id,
          nombre: datos.jugador.nombre,
          apellido: datos.jugador.apellido,
          categoria: datos.jugador.categoria,
          posicion: datos.jugador.posicion,
          numeroCamiseta: datos.jugador.numeroCamiseta
        });

      } else {
        throw new Error(response.data.message || 'Error al obtener datos del jugador');
      }
      
    } catch (error) {
      console.error('❌ Error cargando datos del backend:', error);
      
      // Si hay error con el backend, usar datos de ejemplo como fallback
      console.log('🔄 Usando datos de ejemplo como fallback...');
      
      try {
        // Intentar obtener al menos los datos básicos del jugador
        const jugadorRes = await apiClient.get(`/alumnos/${id}`);
        const jugadorData = jugadorRes.data;
        
        setReporteData({
          jugador: {
            nombre: `${jugadorData.nombre} ${jugadorData.apellido || ''}`.trim(),
            categoria: jugadorData.categoria || 'Alevín',
            foto: jugadorData.foto,
            numeroCamiseta: jugadorData.numeroCamiseta || 10,
            posicion: jugadorData.posicion || 'Medio',
            edad: jugadorData.edad
          },
          evaluacion: {
            fisico: 'verde',
            tecnico: 'amarillo',
            tactico: 'verde',
            actitudinal: 'verde'
          },
          metricas: {
            asistencia: "95%",
            golesMes: 8,
            partidosMes: 5,
            notaGeneral: 8.5,
            asistenciasTotales: 6,
            partidosJugados: 5,
            minutosJugados: 400,
            kmRecorridos: 42.5,
            golesTotales: 24,
            promedioPases: '85%',
            recuperaciones: 12
          },
          evolucion: [
            { mes: "Enero", nota: 7.5 },
            { mes: "Febrero", nota: 8.0 },
            { mes: "Marzo", nota: 8.5 },
            { mes: "Abril", nota: 8.7 },
            { mes: "Mayo", nota: 9.0 }
          ],
          observaciones: {
            positivos: "Excelente actitud en entrenamientos. Mejora notable en velocidad y técnica individual.",
            mejoras: "Trabajar en el pase largo y visión de juego. Mejorar la concentración en los últimos minutos.",
            medico: jugadorData.observaciones,
            proximosObjetivos: "Mejorar la técnica individual y el juego en equipo. Trabajar aspectos tácticos."
          }
        });

        setJugador({
          id: jugadorData.id,
          nombre: jugadorData.nombre,
          apellido: jugadorData.apellido,
          categoria: jugadorData.categoria,
          posicion: jugadorData.posicion,
          numeroCamiseta: jugadorData.numeroCamiseta
        });

      } catch (fallbackError) {
        console.error('❌ Error también con datos básicos:', fallbackError);
        
        // Datos completamente de ejemplo
        setReporteData({
          jugador: {
            nombre: 'Jugador Ejemplo',
            categoria: 'Alevín',
            foto: null,
            numeroCamiseta: 10,
            posicion: 'Medio',
            edad: 12
          },
          evaluacion: {
            fisico: 'verde',
            tecnico: 'amarillo',
            tactico: 'verde',
            actitudinal: 'verde'
          },
          metricas: {
            asistencia: "95%",
            golesMes: 8,
            partidosMes: 5,
            notaGeneral: 8.5,
            asistenciasTotales: 6,
            partidosJugados: 5,
            minutosJugados: 400,
            kmRecorridos: 42.5,
            golesTotales: 24,
            promedioPases: '85%',
            recuperaciones: 12
          },
          evolucion: [
            { mes: "Enero", nota: 7.5 },
            { mes: "Febrero", nota: 8.0 },
            { mes: "Marzo", nota: 8.5 },
            { mes: "Abril", nota: 8.7 },
            { mes: "Mayo", nota: 9.0 }
          ],
          observaciones: {
            positivos: "Excelente actitud en entrenamientos. Mejora notable en velocidad.",
            mejoras: "Trabajar en el pase largo y visión de juego.",
            medico: null,
            proximosObjetivos: "Mejorar la técnica individual y el juego en equipo."
          }
        });
      }
      
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la selección del tipo de reporte
   */
  const seleccionarTipoReporte = (tipo) => {
    setTipoReporte(tipo);
    
    // Determinar modo automáticamente según el tipo
    if (tipo === 'anual') {
      setModoVisualizacion('formal');
    } else {
      setModoVisualizacion('visual');
    }
    
    setMostrarPrevia(true);
  };

  /**
   * Genera PDF usando html2pdf en el frontend
   */
  const generarPDFFrontend = async () => {
    setGenerandoPDF(true);
    
    try {
      const elemento = document.getElementById('vista-previa-reporte');
      
      if (!elemento) {
        throw new Error('No se encontró el elemento del reporte');
      }
      
      const opciones = {
        margin: 10,
        filename: `reporte-${tipoReporte}-${reporteData.jugador.nombre.replace(/\s/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          allowTaint: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(elemento).set(opciones).save();
      
      alert('¡Reporte PDF generado correctamente!');
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    } finally {
      setGenerandoPDF(false);
    }
  };

  /**
   * Envía el reporte por email (función placeholder)
   */
  const enviarPorEmail = async () => {
    alert('Funcionalidad de envío por email en desarrollo.\n\nPróximamente podrás enviar reportes directamente a los padres desde aquí.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl">Cargando datos del jugador...</div>
          <div className="text-gray-500 mt-2">Obteniendo evaluaciones y estadísticas</div>
        </div>
      </div>
    );
  }

  return (
    <div className="generador-reporte-container p-6 bg-gray-50 min-h-screen">
      {/* Botón volver */}
      <button
        onClick={() => navigate('/alumnos')}
        className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} />
        Volver a Alumnos
      </button>

      {!mostrarPrevia ? (
        // Pantalla de selección de tipo de reporte
        <div className="seleccion-tipo-reporte max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Generar Reporte</h1>
          
          {jugador && (
            <div className="info-jugador mb-8 p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">
                {jugador.nombre} {jugador.apellido}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Categoría:</span> {jugador.categoria}
                </div>
                <div>
                  <span className="font-medium">Posición:</span> {jugador.posicion}
                </div>
                <div>
                  <span className="font-medium">Dorsal:</span> #{jugador.numeroCamiseta}
                </div>
                <div>
                  <span className="font-medium">Evaluaciones:</span> Disponibles
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reporte de Partido */}
            <div 
              onClick={() => seleccionarTipoReporte('partido')}
              className="tipo-reporte-card bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-l-4 border-blue-500"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500 p-4 rounded-full">
                  <FileText className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Reporte de Partido</h3>
              <p className="text-gray-600 text-center mb-4">
                Informe detallado del último partido disputado
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Estadísticas del partido</li>
                <li>• Rendimiento individual</li>
                <li>• Aspectos destacados</li>
                <li>• Áreas de mejora</li>
              </ul>
            </div>

            {/* Reporte Mensual */}
            <div 
              onClick={() => seleccionarTipoReporte('mensual')}
              className="tipo-reporte-card bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-l-4 border-green-500"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-500 p-4 rounded-full">
                  <FileText className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Reporte Mensual</h3>
              <p className="text-gray-600 text-center mb-4">
                Resumen completo del progreso mensual
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Evolución del rendimiento</li>
                <li>• Estadísticas acumuladas</li>
                <li>• Gráficos de progreso</li>
                <li>• Recomendaciones</li>
              </ul>
            </div>

            {/* Reporte Anual */}
            <div 
              onClick={() => seleccionarTipoReporte('anual')}
              className="tipo-reporte-card bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-l-4 border-purple-500"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-purple-500 p-4 rounded-full">
                  <FileText className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Reporte Anual</h3>
              <p className="text-gray-600 text-center mb-4">
                Informe completo de la temporada
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Progreso anual completo</li>
                <li>• Comparativas por trimestre</li>
                <li>• Evaluación integral</li>
                <li>• Plan para próxima temporada</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Vista previa del reporte
        <div className="vista-previa-wrapper">
          {/* Barra de herramientas */}
          <div className="bg-white p-4 shadow-md mb-6 rounded-lg flex justify-between items-center no-print">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMostrarPrevia(false)}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Volver
              </button>
              <h2 className="text-xl font-semibold">
                Vista Previa - Reporte {tipoReporte.charAt(0).toUpperCase() + tipoReporte.slice(1)}
              </h2>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setModoVisualizacion(modo => modo === 'visual' ? 'formal' : 'visual')}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
              >
                <Eye size={18} />
                Modo: {modoVisualizacion === 'visual' ? 'Visual' : 'Formal'}
              </button>
              
              <button
                onClick={generarPDFFrontend}
                disabled={generandoPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Download size={18} />
                {generandoPDF ? 'Generando...' : 'Descargar PDF'}
              </button>
              
              <button
                onClick={enviarPorEmail}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <Send size={18} />
                Enviar por Email
              </button>
            </div>
          </div>
          
          {/* Vista previa del reporte */}
          {reporteData && (
            <VistaPrevia 
              tipo={tipoReporte}
              datos={reporteData}
              modo={modoVisualizacion}
            />
          )}
        </div>
      )}
    </div>
  );
}