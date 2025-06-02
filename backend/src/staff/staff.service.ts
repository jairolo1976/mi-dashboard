import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    console.log('🟢 STAFF CREATE - INICIO');
    console.log('🟢 Datos recibidos:', JSON.stringify(dto, null, 2));
    
    try {
      // Crear directamente sin validaciones complejas
      const result = await this.prisma.staff.create({
        data: {
          nombre: dto.nombre,
          apellido: dto.apellido,
          cargo: dto.cargo,
          email: dto.email,
          password: dto.password,
          telefono: dto.telefono || null,
          activo: dto.activo !== undefined ? Boolean(dto.activo) : true
        }
      });
      
      console.log('✅ Staff creado exitosamente:', result.id);
      return result;
      
    } catch (error) {
      console.error('❌ Error al crear staff:', error.message);
      console.error('❌ Error completo:', error);
      throw new Error(`Error al crear staff: ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.staff.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.staff.findUnique({ where: { id } });
  }

  update(id: number, dto: any) {
    return this.prisma.staff.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.staff.delete({ where: { id } });
  }
}