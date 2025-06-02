// backend/src/alumnos/dto/create-alumno.dto.ts
import { IsString, IsInt, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateAlumnoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsInt()
  edad: number;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  colegio?: string;

  @IsOptional()
  @IsString()
  tallaCamiseta?: string;

  @IsOptional()
  @IsString()
  tallaPantalon?: string;

  @IsOptional()
  @IsString() // 'foto' es un string base64
  foto?: string;

  @IsOptional()
  @IsString()
  grupoSanguineo?: string;

  @IsOptional()
  @IsString()
  alergias?: string;

  @IsOptional()
  @IsString()
  enfermedades?: string;

  @IsOptional()
  @IsString()
  medicamentos?: string;

  @IsOptional()
  @IsString()
  seguroMedico?: string;

  @IsOptional()
  @IsString()
  numeroSeguro?: string;

  @IsOptional()
  @IsString()
  nombreTutor?: string;

  @IsOptional()
  @IsString()
  apellidoTutor?: string;

  @IsOptional()
  @IsString()
  telefonoTutor?: string;

  @IsOptional()
  @IsString()
  emailTutor?: string;

  @IsOptional()
  @IsString()
  relacionTutor?: string;

  @IsOptional()
  @IsString()
  nombreTutor2?: string;

  @IsOptional()
  @IsString()
  apellidoTutor2?: string;

  @IsOptional()
  @IsString()
  telefonoTutor2?: string;

  @IsOptional()
  @IsString()
  emailTutor2?: string;

  @IsOptional()
  @IsString()
  relacionTutor2?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}