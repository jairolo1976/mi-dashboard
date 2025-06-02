// src/staff/dto/create-staff.dto.ts
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  cargo: string;

  @IsEmail() // Mejor validación para emails
  email: string;

  @IsString()
  password: string;

  @IsOptional() // Campo opcional
  @IsString()
  telefono?: string;

  @IsOptional() // Campo opcional
  @IsBoolean() // Tu modelo Prisma 'activo' es de tipo Boolean, así que es mejor validar como boolean
  activo?: boolean; // Si recibes "true" o "false" como string, el ValidationPipe de NestJS con 'transform: true' lo convertirá automáticamente a booleano.
}