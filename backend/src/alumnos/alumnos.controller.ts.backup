import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('alumnos')
@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN','STAFF')
  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoDto) {
    console.log('🎯 CONTROLADOR - Datos recibidos:', createAlumnoDto);
    return this.alumnosService.create(createAlumnoDto);
  }

  @Post('test')
  async createTest(@Body() data: any) {
    console.log('🔥 TEST - Datos raw:', data);
    return this.alumnosService.create(data);
  }

  // // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.alumnosService.findAll();
  }

  // // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alumnosService.findOne(+id);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN','STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    return this.alumnosService.update(+id, updateAlumnoDto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alumnosService.remove(+id);
  }
}