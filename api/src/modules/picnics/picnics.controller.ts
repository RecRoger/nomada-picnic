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
      $ref: 'Object'
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
  async create(
    @Query() partialPayment: 'full' | 'deposit',
    @Body() createPicnicDto: CreatePicnicDto
  ): Promise<string> {
    return this.picnicsService.createPicnic(createPicnicDto, partialPayment);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Recibir notificaciones asíncronas IPN/Webhook de Mercado Pago' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificación procesada correctamente' })
  async handleWebhook(@Query() query: any, @Body() body: any) {
    // Mercado Pago envía notificaciones tipo payment.created / payment.updated
    const topic = query.topic || query.type || body.type;
    const paymentId = query['data.id'] || body?.data?.id;
    if (topic === 'payment' && paymentId) {
      await this.picnicsService.processPaymentWebhook(paymentId);
    }
    return { status: 'ok' };
  }

}
