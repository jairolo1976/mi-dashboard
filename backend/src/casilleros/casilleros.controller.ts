import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CasillerosService } from './casilleros.service';
import { CreateCasilleroDto } from './dto/create-casillero.dto';
import { UpdateCasilleroDto } from './dto/update-casillero.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('casilleros')
@Controller('casilleros')
export class CasillerosController {
  constructor(private readonly service: CasillerosService) {}

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN','STAFF')
  @Post()
  create(@Body() dto: CreateCasilleroDto) {
    return this.service.create(dto);
  }

  // // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN','STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCasilleroDto) {
    return this.service.update(+id, dto);
  }

  // // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
