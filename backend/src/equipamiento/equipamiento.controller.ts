// src/equipamiento/equipamiento.controller.ts
import {
    Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
  } from '@nestjs/common';
  import { EquipamientoService } from './equipamiento.service';
  import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
  import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { ApiTags } from '@nestjs/swagger';
  
  @ApiTags('equipamiento')
  @Controller('equipamiento')
  export class EquipamientoController {
    constructor(private readonly service: EquipamientoService) {}
  
    // // @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN','STAFF')
    @Post()
    create(@Body() dto: CreateEquipamientoDto) {
      return this.service.create(dto);
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
    @Roles('ADMIN','STAFF')
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateEquipamientoDto) {
      return this.service.update(+id, dto);
    }
  
    // // @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(+id);
    }
  }
  