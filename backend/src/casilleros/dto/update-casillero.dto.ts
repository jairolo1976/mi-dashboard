import { PartialType } from '@nestjs/swagger';
import { CreateCasilleroDto } from './create-casillero.dto';
export class UpdateCasilleroDto extends PartialType(CreateCasilleroDto) {}