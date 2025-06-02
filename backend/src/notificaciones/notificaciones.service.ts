// src/notificaciones/notificaciones.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// No necesitas importar 'Prisma' de @prisma/client si no haces mapeo explícito a tipos como Prisma.NotificacionUncheckedCreateInput
// import { Prisma } from '@prisma/client';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionesService {
  constructor(private prisma: PrismaService) {}

  // Simplemente pasa el DTO directamente si coincide con los campos del modelo
  // (sin incluir createdAt y updatedAt que Prisma gestiona automáticamente)
  create(createNotificacionDto: CreateNotificacionDto) {
    // ¡Hemos eliminado las líneas que hacían referencia a 'fecha'!
    return this.prisma.notificacion.create({ data: createNotificacionDto });
  }

  findAll() {
    return this.prisma.notificacion.findMany();
  }

  findOne(id: number) {
    return this.prisma.notificacion.findUnique({ where: { id } });
  }

  update(id: number, updateNotificacionDto: UpdateNotificacionDto) {
    return this.prisma.notificacion.update({ where: { id }, data: updateNotificacionDto });
  }

  remove(id: number) {
    return this.prisma.notificacion.delete({ where: { id } });
  }
}