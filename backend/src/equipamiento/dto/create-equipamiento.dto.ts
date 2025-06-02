// src/equipamiento/dto/create-equipamiento.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator'; // Agregamos IsNumber

export class CreateEquipamientoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString() // 'categoria' es OBLIGATORIO en tu modelo Prisma
  categoria: string; // ¡AGREGADO!

  @IsOptional()
  @IsString() // 'estado' es un STRING en tu modelo Prisma (ej: "disponible", "en uso", "en reparación")
  estado?: string; // CAMBIADO: Antes 'disponible?: boolean', ahora 'estado?: string'

  @IsOptional()
  @IsNumber() // 'cantidad' es un NÚMERO en tu modelo Prisma
  cantidad?: number; // ¡AGREGADO!
}