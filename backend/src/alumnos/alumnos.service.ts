// backend/src/alumnos/alumnos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// Importa CreateAlumnoDto si aún no lo has hecho, aunque para 'data: any' no es estrictamente necesario, es buena práctica.
// import { CreateAlumnoDto } from './dto/create-alumno.dto';


@Injectable()
export class AlumnosService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { // Puedes cambiar 'data: any' a 'data: CreateAlumnoDto'
    try {
      const alumnoData = {
        nombre: data.nombre || 'Sin nombre',
        apellido: data.apellido || null,
        edad: parseInt(data.edad) || 10,
        categoria: data.categoria || 'Alevín',
        telefono: data.telefono || null,
        email: data.email || null,
        direccion: data.direccion || null,
        colegio: data.colegio || null,
        tallaCamiseta: data.tallaCamiseta || null,
        tallaPantalon: data.tallaPantalon || null,
        fechaNacimiento: data.fechaNacimiento && data.fechaNacimiento.trim() !== '' ? new Date(data.fechaNacimiento) : null,
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
        nombreTutor2: data.nombreTutor2 || null,
        apellidoTutor2: data.apellidoTutor2 || null,
        telefonoTutor2: data.telefonoTutor2 || null,
        emailTutor2: data.emailTutor2 || null,
        relacionTutor2: data.relacionTutor2 || null,
        observaciones: data.observaciones || null,
        foto: data.foto || null, // ESTE CAMPO ES CLAVE
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
      edad: data.edad ? parseInt(data.edad) : undefined,
      fechaNacimiento: data.fechaNacimiento && data.fechaNacimiento.trim() !== '' ? new Date(data.fechaNacimiento) : null
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

  async getEstadisticas() {
    try {
      const alumnos = await this.prisma.alumno.findMany({
        where: { activo: true }
      });

      const estadisticas = {
        total: alumnos.length,
        porCategoria: {
          'Benjamín': 0,
          'Alevín': 0,
          'Infantil': 0,
          'Cadete': 0,
          'Juvenil': 0,
          'Senior': 0
        }
      };

      alumnos.forEach(alumno => {
        if (estadisticas.porCategoria[alumno.categoria] !== undefined) {
          estadisticas.porCategoria[alumno.categoria]++;
        }
      });

      return estadisticas;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        total: 0,
        porCategoria: {
          'Benjamín': 0,
          'Alevín': 0,
          'Infantil': 0,
          'Cadete': 0,
          'Juvenil': 0,
          'Senior': 0
        }
      };
    }
  }
}