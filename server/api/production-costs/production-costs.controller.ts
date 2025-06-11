import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductionCostsService } from './production-costs.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cost } from 'server/database/schemas/production-cost.schema';
import { ResponseDto } from 'server/models/responses.dto';
import { CostDto } from 'server/models/cost.dto';
import { ResponseInterceptor } from 'server/interceptors/response.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseNumberInterceptor } from 'server/interceptors/parse-number.interceptor';
import { ParseBooleanInterceptor } from 'server/interceptors/parse-boolean.interceptor';

@Controller({ version: '1' })
@ApiTags('ProductionCosts')
@UseInterceptors(ResponseInterceptor)
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
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['providerCost', 'productionCost', 'earnPercentage', 'guestsCoverage']),
    new ParseBooleanInterceptor(['deliveryRequired', 'multipleAllowed'])
  )
  async create(
    @Body() createCost: CostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Cost> {
    return this.costsService.create(createCost, files);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un costo existente' })
  @ApiBody({ type: CostDto })
  @ApiResponse({ status: 201, description: 'Costo editado', type: ResponseDto<CostDto> })
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['providerCost', 'productionCost', 'earnPercentage', 'guestsCoverage']),
    new ParseBooleanInterceptor(['deliveryRequired', 'multipleAllowed'])
  )
  async update(
    @Param('id') id: string,
    @Body() updateCost: CostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Cost> {
    return this.costsService.update(id, updateCost, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un costo existente' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: ResponseDto<boolean> })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.costsService.remove(id);
  }

}
