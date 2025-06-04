import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';

@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) {}

  @Post('fisica/:jugadorId')
  async crearEvaluacionFisica(
    @Param('jugadorId') jugadorId: string,
    @Body() datos: any,
  ) {
    return this.evaluacionesService.crearEvaluacionFisica(+jugadorId, datos);
  }

  @Post('tecnica/:jugadorId')
  async crearEvaluacionTecnica(
    @Param('jugadorId') jugadorId: string,
    @Body() datos: any,
  ) {
    return this.evaluacionesService.crearEvaluacionTecnica(+jugadorId, datos);
  }

  @Post('actitudinal/:jugadorId')
  async crearEvaluacionActitudinal(
    @Param('jugadorId') jugadorId: string,
    @Body() datos: any,
  ) {
    return this.evaluacionesService.crearEvaluacionActitudinal(+jugadorId, datos);
  }

  @Get('jugador/:jugadorId')
  async obtenerEvaluacionesJugador(@Param('jugadorId') jugadorId: string) {
    return this.evaluacionesService.obtenerEvaluacionesJugador(+jugadorId);
  }

  @Get('pendientes')
  async obtenerEvaluacionesPendientes() {
    return this.evaluacionesService.obtenerEvaluacionesPendientes();
  }

  @Post('enviar-reporte/:jugadorId')
  async enviarReportePorEmail(@Param('jugadorId') jugadorId: string) {
    return this.evaluacionesService.enviarReportePorEmail(+jugadorId);
  }
}
