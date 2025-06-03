import React from 'react';
import SemaforoVisual from '../graficos/SemaforoVisual';
import RadarHabilidades from '../graficos/RadarHabilidades';
import EvolucionLineal from '../graficos/EvolucionLineal';
import '../reportes.css';

/**
 * Plantilla de Reporte Mensual
 * Diseñado para padres con estilo visual y amigable
 */
export default function ReporteMensual({ datos, modo = 'visual' }) {
  const { jugador, evaluacion, metricas, evolucion, observaciones } = datos;
  
  // Calcular estadísticas del mes
  const totalPartidos = metricas.partidosMes || 5;
  const golesPromedio = (metricas.golesMes / totalPartidos).toFixed(1);
  
  return (
    <div className={`reporte-container reporte-${modo}`}>
      <div className="reporte-a4">
        {/* Header */}
        <div className="reporte-header">
          <h1 className="reporte-titulo">Reporte Mensual de Rendimiento</h1>
          <p className="reporte-subtitulo">
            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Información del jugador */}
        <div className="jugador-info">
          <img 
            src={jugador.foto || '/api/placeholder/120/120'} 
            alt={jugador.nombre}
            className="jugador-foto"
          />
          <div className="jugador-datos">
            <h2>{jugador.nombre}</h2>
            <div>
              <span className="jugador-badge">{jugador.categoria}</span>
              <span className="jugador-badge">#{jugador.numeroCamiseta}</span>
              <span className="jugador-badge">{jugador.posicion}</span>
            </div>
            <p className="text-gray-600 mt-2">
              Academia CALYSM - Centro de Formación Deportiva
            </p>
          </div>
        </div>

        {/* Evaluación General - Semáforo */}
        <div className="reporte-seccion">
          <h3 className="reporte-seccion-titulo">Evaluación General del Mes</h3>
          <SemaforoVisual evaluacion={evaluacion} modo="detallado" />
        </div>

        {/* Métricas destacadas del mes */}
        <div className="reporte-seccion">
          <h3 className="reporte-seccion-titulo">Rendimiento en Números</h3>
          <div className="metricas-grid">
            <div className="metrica-card">
              <div className="metrica-valor">{metricas.asistencia || "95%"}</div>
              <div className="metrica-label">Asistencia</div>
            </div>
            <div className="metrica-card">
              <div className="metrica-valor">{metricas.golesMes || 8}</div>
              <div className="metrica-label">Goles Totales</div>
            </div>
            <div className="metrica-card">
              <div className="metrica-valor">{golesPromedio}</div>
              <div className="metrica-label">Promedio/Partido</div>
            </div>
            <div className="metrica-card">
              <div className="metrica-valor">{metricas.notaGeneral || 8.5}</div>
              <div className="metrica-label">Nota General</div>
            </div>
          </div>
        </div>

        {/* Gráfico Radar de Habilidades */}
        <div className="reporte-seccion">
          <h3 className="reporte-seccion-titulo">Perfil de Habilidades</h3>
          <div style={{ height: '350px' }}>
            <RadarHabilidades 
              datos={evaluacion}
              titulo="Comparación con el promedio de la categoría"
            />
          </div>
        </div>

        {/* Gráfico de Evolución */}
        <div className="reporte-seccion nueva-pagina">
          <h3 className="reporte-seccion-titulo">Evolución del Rendimiento</h3>
          <div style={{ height: '320px' }}>
            <EvolucionLineal 
              datos={evolucion}
              titulo="Progreso en los últimos meses"
              tipo="area"
            />
          </div>
        </div>

        {/* Observaciones */}
        <div className="reporte-seccion">
          <h3 className="reporte-seccion-titulo">Observaciones del Mes</h3>
          
          <div className="observaciones-box">
            <div className="observacion-titulo">💪 Aspectos Destacados</div>
            <div className="observacion-texto">
              {observaciones.positivos || "Excelente actitud en entrenamientos. Mejora notable en velocidad y técnica individual. Gran compañerismo con el equipo."}
            </div>
          </div>

          <div className="observaciones-box mt-4">
            <div className="observacion-titulo">🎯 Áreas de Mejora</div>
            <div className="observacion-texto">
              {observaciones.mejoras || "Trabajar en el pase largo y visión de juego. Mejorar la concentración en los últimos minutos del partido."}
            </div>
          </div>

          {observaciones.medico && (
            <div className="observaciones-box mt-4">
              <div className="observacion-titulo">🏥 Observación Médica</div>
              <div className="observacion-texto">{observaciones.medico}</div>
            </div>
          )}
        </div>

        {/* Recomendaciones para el próximo mes */}
        <div className="reporte-seccion">
          <h3 className="reporte-seccion-titulo">Recomendaciones para el Próximo Mes</h3>
          <ul className="recomendaciones-lista">
            <li className="recomendacion-item">
              <span className="recomendacion-icono">🏃</span>
              <span>Añadir 2 sesiones semanales de ejercicios de resistencia aeróbica</span>
            </li>
            <li className="recomendacion-item">
              <span className="recomendacion-icono">⚽</span>
              <span>Practicar pases largos 15 minutos después de cada entrenamiento</span>
            </li>
            <li className="recomendacion-item">
              <span className="recomendacion-icono">🧠</span>
              <span>Ejercicios de concentración y visualización antes de los partidos</span>
            </li>
            <li className="recomendacion-item">
              <span className="recomendacion-icono">💤</span>
              <span>Mantener 8-9 horas de sueño diario para optimizar la recuperación</span>
            </li>
          </ul>
        </div>

        {/* Mensaje motivacional */}
        {modo === 'visual' && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
            <p className="text-lg font-semibold text-blue-800">
              ¡Sigue así, {jugador.nombre}! 🌟
            </p>
            <p className="text-blue-700 mt-2">
              Tu esfuerzo y dedicación se reflejan en tu progreso. 
              ¡Estamos muy orgullosos de ti!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center text-sm text-gray-500">
          <p>CALYSM - Sistema de Gestión Deportiva</p>
          <p>Reporte generado el {new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
}