import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller()
export class DashboardController {
  constructor(private service: DashboardService) {}

  // // // @UseGuards(JwtAuthGuard)
  @Get('resumen-dashboard')
  getResumen() {
    return this.service.getResumen();
  }
}