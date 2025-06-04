import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Post()
  create(@Body() createAlumnoDto: any) {
    console.log('🎯 CONTROLADOR - Datos recibidos:', createAlumnoDto);
    return this.alumnosService.create(createAlumnoDto);
  }

  @Post('test')
  async createTest(@Body() data: any) {
    console.log('🔥 TEST - Datos raw:', data);
    return this.alumnosService.create(data);
  }

  @Get()
  findAll() {
    return this.alumnosService.findAll();
  }

  @Get('estadisticas')
  async getEstadisticas() {
    return this.alumnosService.getEstadisticas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alumnosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlumnoDto: any) {
    return this.alumnosService.update(+id, updateAlumnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alumnosService.remove(+id);
  }
}
