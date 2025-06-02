import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { MensajesService } from './mensajes.service';
  import { CreateMensajeDto } from './dto/create-mensaje.dto';
  import { UpdateMensajeDto } from './dto/update-mensaje.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { ApiTags } from '@nestjs/swagger';
  
  @ApiTags('mensajes')
  @Controller('mensajes')
  export class MensajesController {
    constructor(private readonly service: MensajesService) {}
  
    // // @UseGuards(JwtAuthGuard)
    @Get('noleidos')
    findUnread() {
      return this.service.countUnread().then((count) => ({ count }));
    }
  
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
    @Roles('ADMIN', 'STAFF')
    @Post()
    create(@Body() dto: CreateMensajeDto) {
      return this.service.create(dto);
    }
  
    // // @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'STAFF')
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateMensajeDto) {
      return this.service.update(+id, dto);
    }
  
    // // @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(+id);
    }
  }
  