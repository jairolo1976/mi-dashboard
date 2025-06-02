// src/documentos/dto/create-documento.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator'; // Necesitamos IsNumber para alumnoId

export class CreateDocumentoDto {
  @IsString()
  titulo: string;

  @IsString()
  archivo: string; // CAMBIO: Ahora coincide con el modelo Prisma

  @IsString()
  tipo: string;    // AGREGADO: Es un campo obligatorio en tu modelo Prisma

  @IsOptional()
  @IsString()
  descripcion?: string; // AGREGADO: Es un campo opcional en tu modelo Prisma

  @IsOptional()
  @IsNumber() // Usa IsNumber para campos numéricos
  alumnoId?: number; // AGREGADO: Es un campo opcional en tu modelo Prisma
}