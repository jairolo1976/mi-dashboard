import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MensajesService } from './mensajes.service';
import { MensajesController } from './mensajes.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MensajesController],
  providers: [MensajesService],
})
export class MensajesModule {}