import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { PlaceDto } from 'server/models/place.dto';
import { Place } from 'server/database/schemas/places.schema';
import { ResponseInterceptor } from 'server/interceptors/response.interceptor';
import { ResponseDto } from 'server/models/responses.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseNumberInterceptor } from 'server/interceptors/parse-number.interceptor';

@Controller({ version: '1' })
@ApiTags('Places')
@UseInterceptors(ResponseInterceptor)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los lugares' })
  @ApiResponse({ status: 201, description: 'Lista de lugares entera', type: ResponseDto<Place[]> })
  async findAll(): Promise<Place[]> {
    return this.placesService.findAll();
  }

  @Get(':type')
  @ApiOperation({ summary: 'Obtener todos los lugares de un tipo' })
  @ApiResponse({ status: 201, description: 'Lista de lugares por tipo', type: ResponseDto<Place[]> })
  async getByType(@Param('type') type: string): Promise<Place[]> {
    return this.placesService.findAll(type);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lugar' })
  @ApiBody({ type: PlaceDto })
  @ApiResponse({ status: 201, description: 'Nuevo lugar creado', type: ResponseDto<Place> })
  @UseInterceptors(FilesInterceptor('images'), new ParseNumberInterceptor(['zone', 'transportationCost']))
  async create(
    @Body() createPlaceDto: PlaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Place> {
    return this.placesService.create(createPlaceDto, files);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un lugar existente' })
  @ApiBody({ type: PlaceDto })
  @UseInterceptors(FilesInterceptor('images'), new ParseNumberInterceptor(['zone', 'transportationCost']))
  @ApiResponse({ status: 201, description: 'Lugar editado', type: ResponseDto<Place> })
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: PlaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Place> {
    return this.placesService.update(id, updatePlaceDto, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lugar existente' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: ResponseDto<boolean> })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.placesService.remove(id);
  }

}
