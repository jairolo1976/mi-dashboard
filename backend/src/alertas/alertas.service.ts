// backend/src/alumnos/alumnos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlumnosService { // <-- Aquí empieza la clase
  constructor(private prisma: PrismaService) {}

  // ESTE MÉTODO 'create' DEBE ESTAR AQUÍ DENTRO DE LA CLASE
  async create(data: any) { // O data: CreateAlumnoDto, si importaste CreateAlumnoDto
    try {
      const alumnoData = {
        nombre: data.nombre || 'Sin nombre',
        apellido: data.apellido || null,
        edad: parseInt(data.edad) || 10,
        categoria: data.categoria || 'Alevín',
        telefono: data.telefono || null,
        email: data.email || null,
        direccion: data.direccion || null,
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
        grupoSanguineo: data.grupoSanguineo || null,
        alergias: data.alergias || null,
        enfermedades: data.enfermedades || null,
        medicamentos: data.medicamentos || null,
        seguroMedico: data.seguroMedico || null,
        numeroSeguro: data.numeroSeguro || null,
        nombreTutor: data.nombreTutor || null,
        apellidoTutor: data.apellidoTutor || null,
        telefonoTutor: data.telefonoTutor || null,
        emailTutor: data.emailTutor || null,
        relacionTutor: data.relacionTutor || null,
        observaciones: data.observaciones || null,
        foto: data.foto || null,
        activo: true
      };

      console.log('CREANDO ALUMNO CON:', alumnoData);

      const result = await this.prisma.alumno.create({
        data: alumnoData
      });

      console.log('ALUMNO CREADO:', result);
      return result;

    } catch (error) {
      console.error('ERROR en AlumnosService.create:', error);
      throw error;
    }
  }

  async findAll() {
    const alumnos = await this.prisma.alumno.findMany();
    return alumnos;
  }

  findOne(id: number) {
    return this.prisma.alumno.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    const updateData = {
      ...data,
      edad: data.edad ? parseInt(data.edad) : undefined
    };
    return this.prisma.alumno.update({ where: { id }, data: updateData });
  }

  remove(id: number) {
    return this.prisma.alumno.delete({ where: { id } });
  }

  async countByCategoria() {
    try {
      const categorias = await this.prisma.alumno.groupBy({
        by: ['categoria'],
        _count: {
          categoria: true,
        },
      });

      const result = categorias.reduce((acc, item) => {
        acc[item.categoria] = item._count.categoria;
        return acc;
      }, {} as Record<string, number>);

      return result;
    } catch (error) {
      console.error('Error counting by categoria:', error);
      return {};
    }
  }
} // <-- Aquí termina la clase