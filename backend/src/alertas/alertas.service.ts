import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';

@Injectable()
export class AlertasService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateAlertaDto) {
    return this.prisma.alerta.create({ data });
  }

  findAll() {
    return this.prisma.alerta.findMany();
  }

  findOne(id: number) {
    return this.prisma.alerta.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateAlertaDto) {
    return this.prisma.alerta.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.alerta.delete({ where: { id } });
  }
}