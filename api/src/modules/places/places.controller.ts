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
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PlacesService } from './places.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { IResponse, IPlace } from '@shared/interfaces';
import { PlaceDto } from 'src/common/models/place.dto';
import { Place } from 'src/database/schemas/places.schema';
import { PlacesTypes } from '@shared/enums';
import { ParseNumberInterceptor } from 'src/common/interceptors/parse-number.interceptor';

@ApiTags('Places')
@Controller({ path: 'places', version: '1' })
@UseInterceptors(ResponseInterceptor)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) { }

  @Get('')
  @ApiOperation({
    summary: 'Obtener todos los lugares (puede recibir de un tipo)',
  })
  // @ApiResponse({
  //   status: 200, // Los GET suelen ser 200, no 201
  //   description: 'Lista de lugares obtenida con éxito',
  //   schema: {
  //     properties: {
  //       status: { type: 'string', example: 'SUCCESS' },
  //       message: { type: 'string', example: 'Operación exitosa' },
  //       data: {
  //         type: 'array',
  //         items: { $ref: getSchemaPath(Place) }, // Si usas la clase del Schema
  //       },
  //     },
  //   },
  // })
  async getByType(@Query('type') type?: PlacesTypes): Promise<IPlace[]> {
    return this.placesService.findAll(type);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lugar' })
  @ApiBody({ type: PlaceDto })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Nuevo lugar creado',
  //   // type: IResponse<IPlace>,
  // })
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['zone', 'transportationCost']),
  )
  async create(
    @Body() createPlaceDto: PlaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IPlace> {
    return this.placesService.create(createPlaceDto, files);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un lugar existente' })
  @ApiBody({ type: PlaceDto })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Lugar editado',
  //   type: IResponse<IPlace>,
  // })
  @UseInterceptors(
    FilesInterceptor('images'),
    new ParseNumberInterceptor(['zone', 'transportationCost']),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: PlaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IPlace> {
    return this.placesService.update(id, updatePlaceDto, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lugar existente' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Status de eliminacion',
  //   type: IResponse<boolean>,
  // })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.placesService.remove(id);
  }
}
