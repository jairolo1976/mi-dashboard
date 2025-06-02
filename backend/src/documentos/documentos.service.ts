import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class DocumentosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateDocumentoDto) {
    return this.prisma.documento.create({ data });
  }

  findAll() {
    return this.prisma.documento.findMany();
  }

  findOne(id: number) {
    return this.prisma.documento.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateDocumentoDto) {
    return this.prisma.documento.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.documento.delete({ where: { id } });
  }
}