import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductionCostsService } from './production-costs.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CostsTypes } from '@shared/enums';
import { CostDto } from 'src/common/models/cost.dto';
import { ParseNumberInterceptor } from 'src/common/interceptors/parse-number.interceptor';
import { ParseBooleanInterceptor } from 'src/common/interceptors/parse-boolean.interceptor';


@Controller({ path: 'costs', version: '1' })
@ApiTags('ProductionCosts')
@UseInterceptors(ResponseInterceptor)
export class ProductionCostsController {
  constructor(private readonly costsService: ProductionCostsService) { }

  @Get('')
  @ApiOperation({ summary: 'Obtener todos los costos de produccion (puede recibir cierto tipo)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de costos',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(CostDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  @ApiQuery({ name: 'type', required: false, enum: CostsTypes })
  async findByType(@Query('type') type: CostsTypes): Promise<CostDto[]> {
    return this.costsService.findAll(type);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo costo' })
  @ApiBody({ type: CostDto })
  @ApiResponse({
    status: 200,
    description: 'Costo nuevo creado',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(CostDto),
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['providerCost', 'productionCost', 'earnPercentage', 'guestsCoverage']),
    new ParseBooleanInterceptor(['deliveryRequired', 'multipleAllowed'])
  )
  async create(
    @Body() createCost: CostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CostDto> {
    return this.costsService.create(createCost, files);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un costo existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: CostDto })
  @ApiResponse({
    status: 200,
    description: 'Costo editado exitosamente',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(CostDto),
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['providerCost', 'productionCost', 'earnPercentage', 'finalPrice', 'guestsCoverage']),
    new ParseBooleanInterceptor(['deliveryRequired', 'multipleAllowed'])
  )
  async update(
    @Param('id') id: string,
    @Body() updateCost: CostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CostDto> {
    return this.costsService.update(id, updateCost, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un costo existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Costo eliminado',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'boolean',
        },
      },
    },
  })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.costsService.remove(id);
  }

}
