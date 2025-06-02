import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';

@Injectable()
export class AlertasService {
  constructor(private prisma: PrismaService) {}

  create(createAlertaDto: CreateAlertaDto) {
    return this.prisma.alerta.create({
      data: createAlertaDto,
    });
  }

  findAll() {
    return this.prisma.alerta.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.alerta.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAlertaDto: UpdateAlertaDto) {
    return this.prisma.alerta.update({
      where: { id },
      data: updateAlertaDto,
    });
  }

  remove(id: number) {
    return this.prisma.alerta.delete({
      where: { id },
    });
  }
}
