import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('documentos')
@Controller('documentos')
export class DocumentosController {
  constructor(private readonly service: DocumentosService) {}

  // // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN','STAFF')
  @Post()
  create(@Body() dto: CreateDocumentoDto) {
    return this.service.create(dto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN','STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentoDto) {
    return this.service.update(+id, dto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}