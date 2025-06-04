import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { StaffModule } from './staff/staff.module';
import { CasillerosModule } from './casilleros/casilleros.module';
import { EventosModule } from './eventos/eventos.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { AlertasModule } from './alertas/alertas.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
 imports: [
   PrismaModule,
   AlumnosModule,
   StaffModule,
   CasillerosModule,
   EventosModule,
   MensajesModule,
   AlertasModule,
   ReportesModule,
 ],
})
export class AppModule {}