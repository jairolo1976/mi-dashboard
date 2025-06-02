import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CasillerosService } from './casilleros.service';
import { CasillerosController } from './casilleros.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CasillerosController],
  providers: [CasillerosService],
})
export class CasillerosModule {}