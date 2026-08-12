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
import { PicnicEventsService } from './picnic-events.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ParseArrayInterceptor } from 'src/common/interceptors/parse-array.interceptor';
import { PicnicEventDto } from 'src/common/models/picnic-events.dto';


@Controller({ path: 'events', version: '1' })
@ApiTags('PicnicEvents')
@UseInterceptors(ResponseInterceptor)
export class PicnicEventsController {
  constructor(private readonly picnicEventsService: PicnicEventsService) { }

  @Get('')
  @ApiOperation({ summary: 'Obtener la lista completa de eventos de picnic' })
  @ApiQuery({ name: 'query', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos obtenida con éxito',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(PicnicEventDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  async findAll(@Query('query') query: string): Promise<PicnicEventDto[]> {
    return this.picnicEventsService.findEvents(query);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento de picnic' })
  @ApiBody({ type: PicnicEventDto })
  @ApiResponse({
    status: 200,
    description: 'Evento creado',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(PicnicEventDto),
        },
      },
    },
  })
  async create(
    @Body() eventDto: PicnicEventDto,
  ): Promise<PicnicEventDto> {
    return this.picnicEventsService.create(eventDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un evento de picnic' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: PicnicEventDto })
  @ApiResponse({
    status: 200,
    description: 'Evento editado exitosamente',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(PicnicEventDto),
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<PicnicEventDto>,
  ): Promise<PicnicEventDto> {
    return this.picnicEventsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un evento de picnic' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Evento eliminado',
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
    return this.picnicEventsService.delete(id);
  }
}