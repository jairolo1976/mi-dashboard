import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlumnosService } from '../alumnos/alumnos.service';
import { EventosService } from '../eventos/eventos.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private alumnos: AlumnosService,
    private eventos: EventosService,
  ) {}

  async getResumen() {
    const [alumnosPorCategoria, eventosProximos, mensajesNoLeidos, ocupados, disponibles, staffTotal, equipamientoTotal, documentosTotal, alertas] = await Promise.all([
      this.alumnos.countByCategoria(),
      this.eventos.findUpcoming(),
      this.prisma.mensaje.count({ where: { leido: false } }),
      this.prisma.casillero.count({ where: { ocupado: true } }),
      this.prisma.casillero.count({ where: { ocupado: false } }),
      this.prisma.staff.count(),
      this.prisma.equipo.count(),
      this.prisma.documento.count(),
      this.prisma.alerta.findMany(),
    ]);

    return {
      alumnosPorCategoria,
      eventosProximos,
      mensajesNoLeidos,
      casilleros: {
        ocupados,
        disponibles,
      },
      staffTotal,
      equipamientoTotal,
      documentosTotal,
      alertas,
    };
  }
}