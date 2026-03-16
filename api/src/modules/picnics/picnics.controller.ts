import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { PicnicsService } from './picnics.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { PicnicDto } from 'src/common/models/picnic.dto';

@Controller({ path: 'picnics', version: '1' })
@ApiTags('Picnics')
@UseInterceptors(ResponseInterceptor)
export class PicnicsController {
  constructor(private readonly picnicsService: PicnicsService) { }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene la informacion de un picnic, consultan por id e email o apellido' })
  @ApiResponse({ status: 201, description: 'Informacion de un picnic', type: Object })
  async findByType(@Param('id') id?: string, @Query('email') email?: string, @Query('lastname') lastname?: string): Promise<PicnicDto> {
    return this.picnicsService.findOne(id, email, lastname);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo picnic' })
  @ApiBody({ type: PicnicDto })
  @ApiResponse({ status: 201, description: 'Nuevo picnic creado', type: Object })
  async create(@Body() picnicDto: PicnicDto): Promise<PicnicDto> {
    return this.picnicsService.create(picnicDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un picnic existente' })
  @ApiBody({ type: PicnicDto })
  @ApiResponse({ status: 201, description: 'Picnic editado', type: Object })
  async update(@Param('id') id: string, @Body() updatePlaceDto: PicnicDto): Promise<PicnicDto> {
    return this.picnicsService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un picnic existente' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: Object })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.picnicsService.remove(id);
  }

}
