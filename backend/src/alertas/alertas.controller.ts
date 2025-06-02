import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('alertas')
@Controller('alertas')
export class AlertasController {
  constructor(private readonly service: AlertasService) {}

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
  create(@Body() dto: CreateAlertaDto) {
    return this.service.create(dto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN','STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlertaDto) {
    return this.service.update(+id, dto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
