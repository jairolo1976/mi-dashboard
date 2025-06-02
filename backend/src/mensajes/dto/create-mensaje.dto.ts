import { IsOptional, IsString } from 'class-validator';

export class CreateMensajeDto {
  @IsString()
  sender: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  date?: string;
}