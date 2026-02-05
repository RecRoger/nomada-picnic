import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  getSchemaPath,
  ApiQuery,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PlacesService } from './places.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { PlaceDto } from 'src/common/models/place.dto';
import { PlacesTypes } from '@shared/enums';
import { ParseNumberInterceptor } from 'src/common/interceptors/parse-number.interceptor';

@Controller({ path: 'places', version: '1' })
@ApiTags('Places')
@UseInterceptors(ResponseInterceptor)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) { }

  @Get('')
  @ApiOperation({
    summary: 'Obtener todos los lugares (puede recibir de un tipo)',
  })
  @ApiQuery({ name: 'type', required: false, enum: PlacesTypes })
  @ApiResponse({
    status: 200,
    description: 'Lista de lugares obtenida con éxito',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(PlaceDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  async getByType(@Query('type') type?: PlacesTypes): Promise<PlaceDto[]> {
    return this.placesService.findPlace(type);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lugar' })
  @ApiBody({ type: PlaceDto })
  @ApiResponse({
    status: 200,
    description: 'Lugar creado',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(PlaceDto),
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['zone', 'transportationCost']),
  )
  async create(
    @Body() createPlaceDto: PlaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<PlaceDto> {
    return this.placesService.create(createPlaceDto, files);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un lugar existente' })
  @ApiBody({ type: PlaceDto })
  @ApiResponse({
    status: 200,
    description: 'Lugar modificado',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(PlaceDto),
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['zone', 'transportationCost']),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: PlaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<PlaceDto> {
    return this.placesService.update(id, updatePlaceDto, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lugar existente' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({
    status: 201,
    description: 'Lugar eliminado',
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
    return this.placesService.remove(id);
  }
}
