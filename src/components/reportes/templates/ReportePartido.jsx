import React from 'react';
import SemaforoVisual from '../graficos/SemaforoVisual';
import RadarHabilidades from '../graficos/RadarHabilidades';
import EvolucionLineal from '../graficos/EvolucionLineal';
import '../reportes.css';

export default function ReporteAnual({ datos, modo = 'formal' }) {
  const { jugador, evaluacion, metricas, evolucion, observaciones } = datos;

  return (
    <div id="vista-previa-reporte" className={`reporte-container ${modo} anual`}>
      {/* Header Formal */}
      <div className="reporte-header formal">
        <div className="logo-section">
          <h1 className="club-name">CALYSM FC</h1>
          <h2 className="reporte-title">Informe Anual de Progreso</h2>
          <h3 className="temporada">Temporada 2024-2025</h3>
        </div>
        <div className="fecha-reporte">
          {new Date().toLocaleDateString('es-ES')}
        </div>
      </div>

      {/* Información del Jugador */}
      <div className="jugador-info formal">
        <div className="jugador-foto">
          {jugador.foto ? (
            <img src={jugador.foto} alt={jugador.nombre} />
          ) : (
            <div className="foto-placeholder">
              {jugador.nombre.charAt(0)}
            </div>
          )}
        </div>
        <div className="jugador-datos">
          <h3>{jugador.nombre}</h3>
          <div className="datos-grid">
            <div><strong>Categoría:</strong> {jugador.categoria}</div>
            <div><strong>Posición:</strong> {jugador.posicion}</div>
            <div><strong>Dorsal:</strong> #{jugador.numeroCamiseta}</div>
            <div><strong>Temporada:</strong> 2024-2025</div>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="resumen-ejecutivo">
        <h3>Resumen Ejecutivo</h3>
        <p>El siguiente informe presenta un análisis integral del desarrollo y progreso del jugador durante la temporada 2024-2025, evaluando aspectos físicos, técnicos, tácticos y actitudinales.</p>
      </div>

      {/* Evaluación Global */}
      <div className="evaluacion-global">
        <h3>Evaluación Global</h3>
        <SemaforoVisual evaluacion={evaluacion} modo="detallado" />
      </div>

      {/* Gráfico Radar */}
      <div className="grafico-radar">
        <h3>Perfil de Habilidades</h3>
        <RadarHabilidades datos={datos} />
      </div>

      {/* Evolución Temporal */}
      <div className="evolucion-temporal">
        <h3>Evolución del Rendimiento</h3>
        <EvolucionLineal datos={evolucion} />
      </div>

      {/* Estadísticas de la Temporada */}
      <div className="estadisticas-temporada">
        <h3>Estadísticas de la Temporada</h3>
        <div className="stats-grid formal">
          <div className="stat-card">
            <span className="stat-label">Partidos Disputados</span>
            <span className="stat-value">{metricas.partidosJugados || 25}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Goles Totales</span>
            <span className="stat-value">{metricas.golesTotales || 12}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Asistencias Totales</span>
            <span className="stat-value">{metricas.asistenciasTotales || 8}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Promedio Pases</span>
            <span className="stat-value">{metricas.promedioPases || '87%'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Asistencia Entrenamientos</span>
            <span className="stat-value">{metricas.asistencia || '92%'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Nota General</span>
            <span className="stat-value">{metricas.notaGeneral || 8.5}/10</span>
          </div>
        </div>
      </div>

      {/* Análisis Detallado */}
      <div className="analisis-detallado">
        <div className="fortalezas">
          <h4>Fortalezas Identificadas</h4>
          <p>{observaciones.positivos}</p>
        </div>
        <div className="areas-mejora">
          <h4>Áreas de Desarrollo</h4>
          <p>{observaciones.mejoras}</p>
        </div>
        <div className="recomendaciones">
          <h4>Recomendaciones para la Próxima Temporada</h4>
          <p>{observaciones.proximosObjetivos}</p>
        </div>
      </div>

      {/* Información Médica (si existe) */}
      {observaciones.medico && (
        <div className="informacion-medica">
          <h4>Consideraciones Médicas</h4>
          <p>{observaciones.medico}</p>
        </div>
      )}

      {/* Footer Formal */}
      <div className="reporte-footer formal">
        <div className="firmas">
          <div className="firma">
            <p>_______________________</p>
            <p>Director Técnico</p>
          </div>
          <div className="firma">
            <p>_______________________</p>
            <p>Entrenador Principal</p>
          </div>
        </div>
        <p className="confidencial">Este documento es confidencial y está destinado exclusivamente para uso interno del club y familia del jugador.</p>
      </div>
    </div>
  );
}