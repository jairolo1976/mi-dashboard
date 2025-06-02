import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEventoDto {
  @IsString()  
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fecha: Date; 

  @IsString()
  tipo: string;          // CAMPO REQUERIDO - Agregado

  @IsOptional()
  @IsString()
  lugar?: string;        // CAMPO OPCIONAL - Agregado
}
