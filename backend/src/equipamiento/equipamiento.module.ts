import { Module } from '@nestjs/common';
import { EquipamientoService } from './equipamiento.service';
import { EquipamientoController } from './equipamiento.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EquipamientoController],
  providers: [EquipamientoService],
})
export class EquipamientoModule {}