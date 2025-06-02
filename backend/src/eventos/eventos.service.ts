import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEventoDto) {
    return this.prisma.evento.create({ data });
  }

  findAll() {
    return this.prisma.evento.findMany();
  }

  findOne(id: number) {
    return this.prisma.evento.findUnique({ where: { id } });
  }

  findUpcoming() {
    return this.prisma.evento.findMany({ where: { fecha: { gte: new Date() } }, orderBy: { fecha: 'asc' } });
  }

  update(id: number, data: UpdateEventoDto) {
    return this.prisma.evento.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.evento.delete({ where: { id } });
  }
}