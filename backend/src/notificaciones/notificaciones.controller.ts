import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly service: NotificacionesService) {}

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
  create(@Body() dto: CreateNotificacionDto) {
    return this.service.create(dto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN','STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNotificacionDto) {
    return this.service.update(+id, dto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
