import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { PicnicsService } from './picnics.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreatePicnicDto, UpdatePicnicDto } from 'src/common/models/create-picnic.dto';
import { IPicnicDetail } from '@shared/interfaces/picnic-detail.interface';
import { QueryPicnicDto } from 'src/common/models/query-picnic.dto';
import { IPaginatedPicnics } from '@shared/interfaces';
import { PaymentMethods, PaymentTypes } from '@shared/enums';

@Controller({ path: 'picnics', version: '1' })
@ApiTags('Picnics')
@UseInterceptors(ResponseInterceptor)
export class PicnicsController {
  constructor(private readonly picnicsService: PicnicsService) { }

  @Get('availability')
  @ApiOperation({
    summary: 'Obtener listado de fechas ocupadas',
    description: 'Devuelve una lista con la fecha y hora de los picnics en el proximo año para validar disponibilidad',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de fechas obtenida exitosamente.',
  })
  async getBookedDates() {
    return await this.picnicsService.getBookedDatesNextYear();
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener listado de picnics paginado',
    description: 'Devuelve la lista paginada y ordenada de picnics con todas sus relaciones populadas.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt', description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'desc', description: 'Dirección del ordenamiento' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de picnics obtenida exitosamente.',
  })
  async findAllPicnics(@Query() queryDto: QueryPicnicDto): Promise<IPaginatedPicnics> {
    return this.picnicsService.findAllPicnics(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de un picnic por ID',
    description: 'Devuelve la información completa de un picnic con paquete, evento, lugar y adicionales populados.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de Mongo (ObjectId) del picnic',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @ApiQuery({ name: 'name', required: true, example: 'Maria', description: 'Nombre del dueño de la reserva' })
  @ApiQuery({ name: 'lastname', required: true, example: 'Martinez', description: 'Apellido del dueño de la reserva' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle del picnic encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Picnic no encontrado.',
  })
  async getPicnicDetails(
    @Param('id') id: string,
    @Query('name') name: string,
    @Query('lastname') lastname: string
  ): Promise<IPicnicDetail> {
    return this.picnicsService.getPicnicDetails(id, name, lastname);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar datos de un picnic',
    description: 'Permite la modificación parcial de un picnic existente.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de Mongo (ObjectId) del picnic a actualizar',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @ApiBody({
    type: UpdatePicnicDto,
    description: 'Campos del picnic que se desean actualizar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Picnic actualizado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Picnic no encontrado o ID no válido.',
  })
  async updatePicnic(
    @Param('id') id: string,
    @Body() updatePicnicDto: UpdatePicnicDto,
  ): Promise<IPicnicDetail> {
    return this.picnicsService.updatePicnic(id, updatePicnicDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un picnic',
    description: 'Elimina permanentemente un registro de picnic por su ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de Mongo (ObjectId) del picnic a eliminar',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Picnic eliminado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Picnic no encontrado o ID no válido.',
  })
  async removePicnic(@Param('id') id: string): Promise<{ message: string; id: string }> {
    return this.picnicsService.removePicnic(id);
  }

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
  @ApiQuery({ name: 'payOption', required: false, enum: PaymentTypes })
  @ApiQuery({ name: 'payMethod', required: false, enum: PaymentMethods })
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
    @Query('payOption') payOption: PaymentTypes,
    @Query('payMethod') payMethod: PaymentMethods,
    @Body() createPicnicDto: CreatePicnicDto
  ): Promise<string> {
    return this.picnicsService.createPicnic(createPicnicDto, payOption, payMethod);
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
