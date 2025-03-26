import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PicnicsService } from 'server/modules/picnics/picnics.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResponseDto } from 'server/models/responses.dto';
import { Picnic } from 'server/database/schemas/picnics.schema';
import { PicnicDto } from 'server/models/picnic.dto';

@Controller({ version: '1' })
@ApiTags('Picnics')
export class PicnicsController {
  constructor(private readonly picnicsService: PicnicsService) { }

  @Get()
  @ApiOperation({ summary: 'Obtiene la informacion de un picnic, consultan por id e email o apellido' })
  @ApiResponse({ status: 201, description: 'Informacion de un picnic', type: ResponseDto<Picnic> })
  async findByType(@Query('id') id?: string, @Query('email') email?: string, @Query('lastname') lastname?: string): Promise<Picnic> {
    return this.picnicsService.findOne(id, email, lastname);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo costo' })
  @ApiBody({ type: PicnicDto })
  @ApiResponse({ status: 201, description: 'Nuevo costo creado', type: ResponseDto<Picnic> })
  async create(@Body() picnicDto: PicnicDto): Promise<Picnic> {
    return this.picnicsService.create(picnicDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un costo existente' })
  @ApiBody({ type: PicnicDto })
  @ApiResponse({ status: 201, description: 'Costo editado', type: ResponseDto<Picnic> })
  async update(@Param('id') id: string, @Body() updatePlaceDto: PicnicDto): Promise<Picnic> {
    return this.picnicsService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un costo existente' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: ResponseDto<boolean> })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.picnicsService.remove(id);
  }

}
