import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { PartidosService } from './partidos.service';

@Controller('api/partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @Post()
  async crearPartido(@Body() data: any) {
    return await this.partidosService.crearPartido(data);
  }

  @Get()
  async obtenerPartidos() {
    return await this.partidosService.obtenerPartidos();
  }

  @Get(':id')
  async obtenerPartido(@Param('id') id: string) {
    return await this.partidosService.obtenerPartido(parseInt(id));
  }

  @Post(':id/alineacion')
  async registrarAlineacion(
    @Param('id') id: string,
    @Body() jugadores: any[]
  ) {
    await this.partidosService.registrarAlineacion(parseInt(id), jugadores);
    return { success: true };
  }

  @Put(':id/resultado')
  async actualizarResultado(
    @Param('id') id: string,
    @Body() data: { golesPropio: number; golesRival: number }
  ) {
    return await this.partidosService.actualizarResultado(
      parseInt(id),
      data.golesPropio,
      data.golesRival
    );
  }

  @Post(':id/estadisticas-equipo')
  async guardarEstadisticasEquipo(
    @Param('id') id: string,
    @Body() stats: any
  ) {
    return await this.partidosService.guardarEstadisticasEquipo(parseInt(id), stats);
  }

  @Post(':id/estadisticas-individuales')
  async guardarEstadisticasIndividuales(
    @Param('id') id: string,
    @Body() data: { alumnoId: number; stats: any }
  ) {
    return await this.partidosService.guardarEstadisticasIndividuales(
      parseInt(id),
      data.alumnoId,
      data.stats
    );
  }

  @Post(':id/evento')
  async registrarEvento(
    @Param('id') id: string,
    @Body() evento: any
  ) {
    return await this.partidosService.registrarEvento(parseInt(id), evento);
  }

  @Get('jugador/:alumnoId/estadisticas')
  async obtenerEstadisticasJugador(@Param('alumnoId') alumnoId: string) {
    return await this.partidosService.obtenerEstadisticasJugador(parseInt(alumnoId));
  }
}
