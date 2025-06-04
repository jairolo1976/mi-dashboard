import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  /**
   * GET /api/reportes/jugador/:id
   * Obtiene todos los datos necesarios para generar reportes de un jugador
   */
  @Get('jugador/:id')
  async obtenerDatosJugador(@Param('id', ParseIntPipe) id: number) {
    try {
      const datos = await this.reportesService.obtenerDatosCompletos(id);
      return {
        success: true,
        data: datos,
        message: 'Datos del jugador obtenidos correctamente'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Error al obtener datos del jugador: ${error.message}`,
          error: error.message
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * GET /api/reportes/jugador/:id/evaluacion-global
   * Obtiene la última evaluación global de un jugador
   */
  @Get('jugador/:id/evaluacion-global')
  async obtenerEvaluacionGlobal(@Param('id', ParseIntPipe) id: number) {
    try {
      const evaluacion = await this.reportesService.obtenerEvaluacionGlobal(id);
      
      if (!evaluacion) {
        return {
          success: true,
          data: null,
          message: 'No se encontraron evaluaciones para este jugador'
        };
      }

      return {
        success: true,
        data: evaluacion,
        message: 'Evaluación global obtenida correctamente'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Error al obtener evaluación global: ${error.message}`,
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/reportes/categoria/:categoria/estadisticas
   * Obtiene estadísticas comparativas de una categoría
   */
  @Get('categoria/:categoria/estadisticas')
  async obtenerEstadisticasCategoria(@Param('categoria') categoria: string) {
    try {
      const estadisticas = await this.reportesService.obtenerEstadisticasCategoria(categoria);
      return {
        success: true,
        data: estadisticas,
        message: `Estadísticas de ${categoria} obtenidas correctamente`
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Error al obtener estadísticas de ${categoria}: ${error.message}`,
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/reportes/test/:id
   * Endpoint de prueba para verificar que los datos se obtienen correctamente
   */
  @Get('test/:id')
  async testDatosJugador(@Param('id', ParseIntPipe) id: number) {
    try {
      const datos = await this.reportesService.obtenerDatosCompletos(id);
      
      // Devolver un resumen de los datos para verificación
      return {
        success: true,
        resumen: {
          jugador: `${datos.jugador.nombre} ${datos.jugador.apellido}`,
          categoria: datos.jugador.categoria,
          evaluacionesEncontradas: {
            tecnicas: datos.evaluacionesTecnicas?.length || 0,
            actitudinales: datos.evaluacionesActitudinales?.length || 0,
            fisicas: datos.resultadosFisicos?.length || 0
          },
          semaforos: datos.evaluacion,
          metricas: datos.metricas
        },
        message: 'Test de datos completado'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Error en test: ${error.message}`,
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}