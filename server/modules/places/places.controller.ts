import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { PlaceDto } from 'server/models/place.dto';
import { Place } from 'server/database/schemas/places.schema';
import { ResponseInterceptor } from 'server/interceptors/response.interceptor';
import { ResponseDto } from 'server/models/responses.dto';

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

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lugar' })
  @ApiBody({ type: PlaceDto })
  @ApiResponse({ status: 201, description: 'Nuevo lugar creado', type: ResponseDto<Place> })
  async create(@Body() createPlaceDto: PlaceDto): Promise<Place> {
    return this.placesService.create(createPlaceDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un lugar existente' })
  @ApiBody({ type: PlaceDto })
  @ApiResponse({ status: 201, description: 'Lugar editado', type: ResponseDto<Place> })
  async update(@Param('id') id: string, @Body() updatePlaceDto: PlaceDto): Promise<Place> {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lugar existente' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: ResponseDto<boolean> })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.placesService.remove(id);
  }

}
