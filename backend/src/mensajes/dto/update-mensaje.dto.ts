// src/mensajes/dto/update-mensaje.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateMensajeDto } from './create-mensaje.dto';

export class UpdateMensajeDto extends PartialType(CreateMensajeDto) {}
// ← asegúrate de que esta llave de cierre esté presente
