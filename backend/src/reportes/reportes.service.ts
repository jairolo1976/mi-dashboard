import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene todos los datos necesarios para generar un reporte de un jugador
   */
  async obtenerDatosCompletos(alumnoId: number) {
    try {
      // 1. Datos básicos del jugador
      const jugador = await this.prisma.alumno.findUnique({
        where: { id: alumnoId }
      });

      if (!jugador) {
        throw new Error('Jugador no encontrado');
      }

      // 2. Última evaluación global
      const evaluacionGlobal = await this.prisma.evaluacionGlobal.findFirst({
        where: { alumnoId },
        orderBy: { fecha: 'desc' }
      });

      // 3. Evaluaciones técnicas recientes (últimos 5 partidos)
      const evaluacionesTecnicas = await this.prisma.evaluacionTecnica.findMany({
        where: { alumnoId },
        orderBy: { fecha: 'desc' },
        take: 5
      });

      // 4. Evaluaciones actitudinales recientes
      const evaluacionesActitudinales = await this.prisma.evaluacionActitudinal.findMany({
        where: { alumnoId },
        orderBy: { fecha: 'desc' },
        take: 3
      });

      // 5. Resultados físicos recientes
      const resultadosFisicos = await this.prisma.resultadoFisico.findMany({
        where: { alumnoId },
        include: {
          prueba: true
        },
        orderBy: { fecha: 'desc' },
        take: 21 // 7 pruebas × 3 evaluaciones
      });

      // 6. Calcular métricas consolidadas
      const metricas = await this.calcularMetricas(alumnoId, evaluacionesTecnicas);

      // 7. Generar datos de evolución
      const evolucion = await this.generarEvolucion(alumnoId);

      return {
        jugador: {
          id: jugador.id,
          nombre: jugador.nombre,
          apellido: jugador.apellido,
          categoria: jugador.categoria,
          posicion: jugador.posicion,
          numeroCamiseta: jugador.numeroCamiseta,
          foto: jugador.foto,
          edad: jugador.edad
        },
        evaluacion: {
          fisico: evaluacionGlobal?.semaforoFisico || 'amarillo',
          tecnico: evaluacionGlobal?.semaforoTecnico || 'amarillo',
          tactico: evaluacionGlobal?.semaforoTactico || 'amarillo',
          actitudinal: evaluacionGlobal?.semaforoActitudinal || 'amarillo'
        },
        metricas,
        evolucion,
        observaciones: {
          positivos: this.generarObservacionesPositivas(evaluacionGlobal, evaluacionesTecnicas),
          mejoras: this.generarObservacionesMejoras(evaluacionGlobal, evaluacionesTecnicas),
          medico: jugador.observaciones,
          proximosObjetivos: this.generarObjetivos(evaluacionGlobal)
        },
        evaluacionesTecnicas,
        evaluacionesActitudinales,
        resultadosFisicos
      };

    } catch (error) {
      console.error('Error obteniendo datos de reporte:', error);
      throw error;
    }
  }

  /**
   * Calcula métricas consolidadas basadas en evaluaciones técnicas
   */
  private async calcularMetricas(alumnoId: number, evaluacionesTecnicas: any[]) {
    if (evaluacionesTecnicas.length === 0) {
      return {
        asistencia: "95%",
        golesMes: 0,
        partidosMes: 0,
        notaGeneral: 7.5,
        asistenciasTotales: 0,
        partidosJugados: 0,
        minutosJugados: 0,
        kmRecorridos: 0
      };
    }

    const totalGoles = evaluacionesTecnicas.reduce((sum, e) => sum + (e.goles || 0), 0);
    const totalAsistencias = evaluacionesTecnicas.reduce((sum, e) => sum + (e.asistencias || 0), 0);
    const totalMinutos = evaluacionesTecnicas.reduce((sum, e) => sum + (e.minutosJugados || 0), 0);
    const totalKm = evaluacionesTecnicas.reduce((sum, e) => sum + (e.kmRecorridos || 0), 0);

    const promedioNotaTecnica = evaluacionesTecnicas.length > 0
      ? evaluacionesTecnicas.filter(e => e.semaforo === 'verde').length / evaluacionesTecnicas.length * 10
      : 7.5;

    return {
      asistencia: "95%", // Por ahora fijo, se puede calcular con asistencias reales
      golesMes: totalGoles,
      partidosMes: evaluacionesTecnicas.length,
      notaGeneral: Math.round(promedioNotaTecnica * 10) / 10,
      asistenciasTotales: totalAsistencias,
      partidosJugados: evaluacionesTecnicas.length,
      minutosJugados: totalMinutos,
      kmRecorridos: totalKm
    };
  }

  /**
   * Genera datos de evolución temporal simulados (se puede mejorar con datos reales)
   */
  private async generarEvolucion(alumnoId: number) {
    // Por ahora generamos datos simulados, pero se puede calcular con evaluaciones históricas
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const baseNota = 7.0;
    
    return meses.map((mes, index) => ({
      mes,
      nota: Math.round((baseNota + (index * 0.3) + Math.random() * 0.5) * 10) / 10
    }));
  }

  /**
   * Genera observaciones positivas basadas en evaluaciones
   */
  private generarObservacionesPositivas(evaluacionGlobal: any, evaluacionesTecnicas: any[]) {
    const observaciones = [];

    if (evaluacionGlobal?.semaforoFisico === 'verde') {
      observaciones.push('Excelente condición física');
    }
    if (evaluacionGlobal?.semaforoTecnico === 'verde') {
      observaciones.push('Muy buena técnica individual');
    }
    if (evaluacionGlobal?.semaforoActitudinal === 'verde') {
      observaciones.push('Actitud ejemplar en entrenamientos');
    }

    const golesRecientes = evaluacionesTecnicas.reduce((sum, e) => sum + (e.goles || 0), 0);
    if (golesRecientes > 3) {
      observaciones.push('Gran efectividad goleadora');
    }

    const asistenciasRecientes = evaluacionesTecnicas.reduce((sum, e) => sum + (e.asistencias || 0), 0);
    if (asistenciasRecientes > 3) {
      observaciones.push('Excelente visión de juego');
    }

    return observaciones.length > 0 
      ? observaciones.join('. ') + '.'
      : 'Muestra progreso constante en su desarrollo deportivo.';
  }

  /**
   * Genera observaciones de mejora
   */
  private generarObservacionesMejoras(evaluacionGlobal: any, evaluacionesTecnicas: any[]) {
    const mejoras = [];

    if (evaluacionGlobal?.semaforoFisico === 'rojo') {
      mejoras.push('Trabajar en la condición física general');
    }
    if (evaluacionGlobal?.semaforoTecnico === 'rojo') {
      mejoras.push('Mejorar técnica individual');
    }
    if (evaluacionGlobal?.semaforoTactico === 'rojo') {
      mejoras.push('Desarrollar comprensión táctica');
    }

    const porcentajePasesPromedio = evaluacionesTecnicas.length > 0
      ? evaluacionesTecnicas.reduce((sum, e) => {
          const total = e.pasesTotales || 1;
          const buenos = e.pasesBuenos || 0;
          return sum + (buenos / total);
        }, 0) / evaluacionesTecnicas.length
      : 0.8;

    if (porcentajePasesPromedio < 0.75) {
      mejoras.push('Mejorar precisión en el pase');
    }

    return mejoras.length > 0 
      ? mejoras.join('. ') + '.'
      : 'Continuar trabajando en todos los aspectos para mantener el progreso.';
  }

  /**
   * Genera objetivos para el próximo período
   */
  private generarObjetivos(evaluacionGlobal: any) {
    const objetivos = [];

    if (evaluacionGlobal?.semaforoFisico !== 'verde') {
      objetivos.push('Mejorar resistencia aeróbica con entrenamientos específicos');
    }
    if (evaluacionGlobal?.semaforoTecnico !== 'verde') {
      objetivos.push('Dedicar 15 minutos diarios a trabajo técnico individual');
    }
    if (evaluacionGlobal?.semaforoActitudinal !== 'verde') {
      objetivos.push('Trabajar en aspectos de liderazgo y comunicación en equipo');
    }

    objetivos.push('Mantener constancia en entrenamientos y competición');

    return objetivos.join('. ') + '.';
  }

  /**
   * Obtiene estadísticas comparativas por categoría
   */
  async obtenerEstadisticasCategoria(categoria: string) {
    const alumnos = await this.prisma.alumno.findMany({
      where: { categoria },
      include: {
        evaluacionesGlobales: {
          orderBy: { fecha: 'desc' },
          take: 1
        }
      }
    });

    // Calcular promedios de la categoría
    const evaluaciones = alumnos
      .map(a => a.evaluacionesGlobales[0])
      .filter(e => e !== undefined);

    const promedio = evaluaciones.length > 0 
      ? evaluaciones.reduce((sum, e) => sum + (e.notaGeneral || 7), 0) / evaluaciones.length
      : 7.5;

    return {
      categoria,
      totalJugadores: alumnos.length,
      promedioGeneral: Math.round(promedio * 10) / 10,
      distribucionSemaforos: {
        verde: evaluaciones.filter(e => e.notaGeneral >= 8.5).length,
        amarillo: evaluaciones.filter(e => e.notaGeneral >= 7 && e.notaGeneral < 8.5).length,
        rojo: evaluaciones.filter(e => e.notaGeneral < 7).length
      }
    };
  }

  /**
   * Obtiene última evaluación global de un jugador
   */
  async obtenerEvaluacionGlobal(alumnoId: number) {
    return await this.prisma.evaluacionGlobal.findFirst({
      where: { alumnoId },
      orderBy: { fecha: 'desc' }
    });
  }
}