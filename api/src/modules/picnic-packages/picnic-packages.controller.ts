import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PicnicPackageService } from './picnic-packages.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { PicnicPackageDto } from 'src/common/models/picnic-package.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseNumberInterceptor } from 'src/common/interceptors/parse-number.interceptor';
import { ParseArrayInterceptor } from 'src/common/interceptors/parse-array.interceptor';
import { IPackagePrice } from '@shared/interfaces/package-prices.interface';


@Controller({ path: 'packages', version: '1' })
@ApiTags('PicnicPackages')
@UseInterceptors(ResponseInterceptor)
export class PicnicPackagesController {
  constructor(private readonly picnicPackageService: PicnicPackageService) { }

  @Get('')
  @ApiOperation({ summary: 'Obtener la lista completa de paquetes de picnic' })
  @ApiQuery({ name: 'query', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de paquetes obtenida con éxito',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(PicnicPackageDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  async findAll(@Query('query') query: string): Promise<PicnicPackageDto[]> {
    return this.picnicPackageService.findPackages(query);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo paquete de picnic' })
  @ApiBody({ type: PicnicPackageDto })
  @ApiResponse({
    status: 200,
    description: 'Paquete creado',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(PicnicPackageDto),
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image'),
    new ParseArrayInterceptor(['includedItems', 'productionCostIds']),
    new ParseNumberInterceptor(['minGuests', 'maxGuests', 'profitPercent', 'expensesPercent', 'bigExpensesPercent', 'extraTransport']),
  )
  async create(
    @Body() packageDto: PicnicPackageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PicnicPackageDto> {
    return this.picnicPackageService.create(packageDto, file);
  }

  @Get(':id/prices')
  @ApiOperation({ summary: 'Obtener los precios de un paquete de picnic por su ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Consulta los precios de un paquete de picnic',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(PicnicPackageDto),
        },
      },
    },
  })
  async findPrices(
    @Param('id') id: string,
    @Query('query') query: string
  ): Promise<IPackagePrice[]> {
    return this.picnicPackageService.findPackagePrices(id, query === 'full');
  }


  @Put(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un paquete de picnic' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: PicnicPackageDto })
  @ApiResponse({
    status: 200,
    description: 'Paquete editado exitosamente',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(PicnicPackageDto),
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image'),
    new ParseArrayInterceptor(['includedItems', 'productionCostIds']),
    new ParseNumberInterceptor(['minGuests', 'maxGuests', 'profitPercent', 'expensesPercent', 'bigExpensesPercent', 'extraTransport']),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<PicnicPackageDto>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PicnicPackageDto> {
    return this.picnicPackageService.update(id, dto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un paquete de picnic' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Paquete eliminado',
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
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.picnicPackageService.delete(id);
  }
}