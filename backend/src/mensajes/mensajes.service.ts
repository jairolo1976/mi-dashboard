import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';

@Injectable()
export class MensajesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMensajeDto) {
    const date = data.date ? new Date(data.date) : new Date();
    return this.prisma.mensaje.create({ data: { ...data, date } });
  }

  findAll() {
    return this.prisma.mensaje.findMany();
  }

  countUnread() {
    return this.prisma.mensaje.count({ where: { leido: false } });
  }

  findOne(id: number) {
    return this.prisma.mensaje.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateMensajeDto) {
    return this.prisma.mensaje.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.mensaje.delete({ where: { id } });
  }
}