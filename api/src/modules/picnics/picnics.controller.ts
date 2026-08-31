import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { PicnicsService } from './picnics.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreatePicnicDto } from 'src/common/models/create-picnic.dto';

@Controller({ path: 'picnics', version: '1' })
@ApiTags('Picnics')
@UseInterceptors(ResponseInterceptor)
export class PicnicsController {
  constructor(private readonly picnicsService: PicnicsService) { }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva reserva de picnic',
    description:
      'Registra en la base de datos la configuración del picnic, adicionales seleccionados y datos del cliente con estado inicial PENDING.',
  })
  @ApiBody({
    type: CreatePicnicDto,
    description: 'Estructura completa de la reserva iniciada desde el checkout',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La reserva del picnic ha sido creada exitosamente.',
    schema: {
      example: {
        _id: '65f1a2b3c4d5e6f7a8b9c0d5',
        package: '65f1a2b3c4d5e6f7a8b9c0d2',
        guestsCount: 4,
        eventDate: '2026-09-15T00:00:00.000Z',
        eventTime: '16:00',
        basePrice: 150000,
        additionals: [
          {
            cost: '65f1a2b3c4d5e6f7a8b9c0d1',
            quantity: 2,
            totalPrice: 15000,
          },
        ],
        clientInfo: {
          name: 'Rogelio',
          lastname: 'Arzola',
          email: 'rogelio@example.com',
          phone: '+5491112345678',
          tyc: true,
          policy: true,
        },
        totalAmount: 165000,
        status: 'PENDING',
        createdAt: '2026-08-28T18:00:00.000Z',
        updatedAt: '2026-08-28T18:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o fallos en las validaciones de class-validator.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno en el servidor al intentar registrar el picnic.',
  })
  async create(@Body() createPicnicDto: CreatePicnicDto) {
    return this.picnicsService.createPicnic(createPicnicDto);
  }

}
