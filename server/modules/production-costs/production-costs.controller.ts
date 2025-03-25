import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductionCostsService } from './production-costs.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cost } from 'server/database/schemas/production-cost.schema';
import { ResponseDto } from 'server/models/responses.dto';
import { CostDto } from 'server/models/cost.dto';

@Controller({ version: '1' })
export class ProductionCostsController {
  constructor(private readonly costsService: ProductionCostsService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los costos de produccion' })
  @ApiResponse({ status: 201, description: 'Lista de costos entera', type: ResponseDto<Cost[]> })
  async findAll(): Promise<Cost[]> {
    return this.costsService.findAll();
  }

  @Get(':type')
  @ApiOperation({ summary: 'Obtener todos los costos de produccion de cierto tipo' })
  @ApiResponse({ status: 201, description: 'Lista de costos de cierto tipo', type: ResponseDto<Cost[]> })
  async findByType(@Param('type') type: string): Promise<Cost[]> {
    return this.costsService.findAll(type);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo costo' })
  @ApiBody({ type: CostDto })
  @ApiResponse({ status: 201, description: 'Nuevo costo creado', type: ResponseDto<Cost> })
  async create(@Body() createPlaceDto: CostDto): Promise<Cost> {
    return this.costsService.create(createPlaceDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un costo existente' })
  @ApiBody({ type: CostDto })
  @ApiResponse({ status: 201, description: 'Costo editado', type: ResponseDto<Cost> })
  async update(@Param('id') id: string, @Body() updatePlaceDto: CostDto): Promise<Cost> {
    return this.costsService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un costo existente' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: ResponseDto<boolean> })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.costsService.remove(id);
  }

}
