import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AlumnosModule } from '../alumnos/alumnos.module';
import { EventosModule } from '../eventos/eventos.module';
import { MensajesModule } from '../mensajes/mensajes.module';
import { CasillerosModule } from '../casilleros/casilleros.module';
import { StaffModule } from '../staff/staff.module';
import { EquipamientoModule } from '../equipamiento/equipamiento.module';
import { DocumentosModule } from '../documentos/documentos.module';
import { AlertasModule } from '../alertas/alertas.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AlumnosModule,
    EventosModule,
    MensajesModule,
    CasillerosModule,
    StaffModule,
    EquipamientoModule,
    DocumentosModule,
    AlertasModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}