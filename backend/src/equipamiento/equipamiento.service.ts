import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';

@Injectable()
export class EquipamientoService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEquipamientoDto) {
    return this.prisma.equipo.create({ data });
  }

  findAll() {
    return this.prisma.equipo.findMany();
  }

  findOne(id: number) {
    return this.prisma.equipo.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateEquipamientoDto) {
    return this.prisma.equipo.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.equipo.delete({ where: { id } });
  }
}