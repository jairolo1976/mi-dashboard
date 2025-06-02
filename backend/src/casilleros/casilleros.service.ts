import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCasilleroDto } from './dto/create-casillero.dto';
import { UpdateCasilleroDto } from './dto/update-casillero.dto';

@Injectable()
export class CasillerosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCasilleroDto) {
    return this.prisma.casillero.create({ data });
  }

  findAll() {
    return this.prisma.casillero.findMany();
  }

  findOne(id: number) {
    return this.prisma.casillero.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCasilleroDto) {
    return this.prisma.casillero.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.casillero.delete({ where: { id } });
  }
}