// src/notificaciones/dto/create-notificacion.dto.ts
import { IsBoolean, IsOptional, IsString, IsNumber } from 'class-validator'; // Agregamos IsNumber por si usas userId

export class CreateNotificacionDto {
  @IsString()
  titulo: string; // ¡AHORA SÍ ESTÁ EL CAMPO 'titulo' REQUERIDO!

  @IsString()
  mensaje: string; // Sin el '!' de non-null assertion

  @IsOptional()
  @IsBoolean()
  leida?: boolean; // Campo opcional que existe en tu modelo Prisma

  @IsOptional()
  @IsNumber() // Campo opcional que existe en tu modelo Prisma
  userId?: number;

  // ¡Hemos ELIMINADO la línea 'fecha: string;' completamente!
}