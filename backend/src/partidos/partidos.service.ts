import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartidosService {
  constructor(private prisma: PrismaService) {}

  async crearPartido(data: any) {
    try {
      const partido = await this.prisma.partido.create({
        data: {
          fecha: new Date(data.fecha),
          categoria: data.categoria,
          rival: data.rival,
          esLocal: data.esLocal,
          competicion: data.competicion,
          resultado: 'Por jugar'
        }
      });
      console.log('🏆 Partido creado:', partido);
      return partido;
    } catch (error) {
      console.error('Error creando partido:', error);
      throw error;
    }
  }

  async obtenerPartidos() {
    return await this.prisma.partido.findMany({
      orderBy: { fecha: 'desc' },
      include: {
        estadisticasEquipo: true,
        _count: {
          select: {
            alineaciones: true,
            estadisticasIndividuales: true
          }
        }
      }
    });
  }

  async obtenerPartido(id: number) {
    return await this.prisma.partido.findUnique({
      where: { id },
      include: {
        alineaciones: {
          include: {
            alumno: true
          }
        },
        estadisticasEquipo: true,
        estadisticasIndividuales: {
          include: {
            alumno: true
          }
        },
        eventosPartido: true,
        reportePartido: true
      }
    });
  }

  async registrarAlineacion(partidoId: number, jugadores: any[]) {
    const alineaciones = jugadores.map(j => ({
      partidoId,
      alumnoId: j.alumnoId,
      posicion: j.posicion,
      esTitular: j.esTitular,
      minutosJugados: j.minutosJugados || 0,
      esCapitan: j.esCapitan || false,
      dorsalPartido: j.dorsalPartido
    }));

    await this.prisma.alineacionPartido.createMany({
      data: alineaciones
    });

    console.log(`📋 Alineación registrada: ${alineaciones.length} jugadores`);
  }

  async actualizarResultado(partidoId: number, golesPropio: number, golesRival: number) {
    const resultado = golesPropio > golesRival ? 'Victoria' : 
                     golesPropio < golesRival ? 'Derrota' : 'Empate';

    return await this.prisma.partido.update({
      where: { id: partidoId },
      data: {
        golesPropio,
        golesRival,
        resultado
      }
    });
  }

  async guardarEstadisticasEquipo(partidoId: number, stats: any) {
    return await this.prisma.estadisticasEquipo.create({
      data: {
        partidoId,
        esEquipoPropio: true,
        ...stats
      }
    });
  }

  async guardarEstadisticasIndividuales(partidoId: number, alumnoId: number, stats: any) {
    return await this.prisma.estadisticasIndividuales.create({
      data: {
        partidoId,
        alumnoId,
        ...stats
      }
    });
  }

  async registrarEvento(partidoId: number, evento: any) {
    return await this.prisma.eventoPartido.create({
      data: {
        partidoId,
        minuto: evento.minuto,
        tipoEvento: evento.tipoEvento,
        // Eliminamos jugadorId ya que no existe en el schema
        esEquipoPropio: evento.esEquipoPropio !== false,
        descripcion: evento.descripcion,
        coordenadaX: evento.coordenadaX,
        coordenadaY: evento.coordenadaY
      }
    });
  }

  async obtenerEstadisticasJugador(alumnoId: number) {
    const stats = await this.prisma.estadisticasIndividuales.findMany({
      where: { alumnoId },
      include: {
        partido: true
      },
      orderBy: { partido: { fecha: 'desc' } }
    });

    const totales = stats.reduce((acc, s) => ({
      partidosJugados: acc.partidosJugados + 1,
      goles: acc.goles + s.goles,
      asistencias: acc.asistencias + s.asistencias,
      minutosJugados: acc.minutosJugados + s.minutosJugados,
      tarjetasAmarillas: acc.tarjetasAmarillas + s.tarjetasAmarillas,
      tarjetasRojas: acc.tarjetasRojas + 0 // No existe el campo en el schema
    }), {
      partidosJugados: 0,
      goles: 0,
      asistencias: 0,
      minutosJugados: 0,
      tarjetasAmarillas: 0,
      tarjetasRojas: 0
    });

    return {
      estadisticas: stats,
      totales
    };
  }
}
