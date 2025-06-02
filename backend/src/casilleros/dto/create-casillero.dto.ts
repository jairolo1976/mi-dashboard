import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCasilleroDto {
  @IsString()
  numero: string;        // Cambiado de number a string para coincidir con Prisma

  @IsOptional()
  @IsBoolean()
  ocupado?: boolean;

  @IsOptional()
  @IsInt()
  alumnoId?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  nombre?: string;      // Mantengo este campo si lo necesitas
}
