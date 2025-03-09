import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SeedService } from './seeder.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';



@ApiTags('database')
@Controller('database')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}
    @Get('seeder')
  @ApiOperation({
    summary: 'Insertar informacion para users, orders, evidences iniciales',
    description: 'Este endpoint siembra datos iniciales d en la base de datos. Contraseña para todos los usuarios es 0123456789',
  })
  seedProducts() {
     
     return this.seedService.seedData();
  }

  

 
}
