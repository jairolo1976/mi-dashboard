import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}