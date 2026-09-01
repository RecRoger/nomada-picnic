import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartAdditionalDto {
  @ApiProperty({
    description: 'ID de Mongo del costo/adicional',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsMongoId()
  @IsNotEmpty()
  costId: string;

  @ApiProperty({
    description: 'Precio Unitario guardado por este adicional (unitPrice * quantity)',
    example: 15000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({
    description: 'Cantidad seleccionada del adicional',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Precio total acumulado por este adicional (unitPrice * quantity)',
    example: 15000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalPrice: number;
}

export class PicnicBookingDto {
  @ApiProperty({
    description: 'ID de Mongo del paquete de picnic seleccionado',
    example: '65f1a2b3c4d5e6f7a8b9c0d2',
  })
  @IsMongoId()
  @IsNotEmpty()
  packageId: string;

  @ApiPropertyOptional({
    description: 'ID de Mongo del evento especial asociado (opcional)',
    example: '65f1a2b3c4d5e6f7a8b9c0d3',
  })
  @IsMongoId()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'ID de Mongo de la locación/lugar (opcional)',
    example: '65f1a2b3c4d5e6f7a8b9c0d4',
  })
  @IsMongoId()
  @IsOptional()
  placeId?: string;

  @ApiProperty({
    description: 'Cantidad minima de comensales/invitados',
    example: 4,
    minimum: 1,
  })
  @IsNumber()
  @Min(2)
  minGuest: number;

  @ApiProperty({
    description: 'Cantidad maxima de comensales/invitados',
    example: 4,
    minimum: 1,
  })
  @IsNumber()
  @Min(2)
  maxGuest: number;

  @ApiProperty({
    description: 'Fecha en que se llevará a cabo el picnic (formato ISO 8601)',
    example: '2026-09-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @ApiProperty({
    description: 'Hora pactada para la experiencia',
    example: '16:00',
  })
  @IsString()
  @IsNotEmpty()
  eventTime: string;

  @ApiProperty({
    description: 'Precio base de la reserva antes de adicionales',
    example: 150000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  basePrice: number;
}

export class PicnicClientInfoDto {
  @ApiProperty({
    description: 'Nombre del cliente principal',
    example: 'Rogelio',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Apellido del cliente principal',
    example: 'Arzola',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Correo electrónico de contacto y confirmación',
    example: 'rogelio@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Teléfono de contacto (permite código de país + y números)',
    example: '+5491112345678',
  })
  @IsString()
  @Matches(/^\+?[0-9]+$/)
  phone: string;

  @ApiPropertyOptional({
    description: 'Mensaje para la pizarra decorativa',
    example: '¡Feliz Aniversario!',
  })
  @IsString()
  @IsOptional()
  boardMessage?: string;

  @ApiPropertyOptional({
    description: 'Bebidas de regalo elegidas',
    example: ['Vino tinto', 'Limonada de menta'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  giftDrinks?: string[];

  @ApiPropertyOptional({
    description: 'Nombre de la persona homenajeada en el evento',
    example: 'Elizabeth',
  })
  @IsString()
  @IsOptional()
  honoredName?: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales o aclaraciones dietarias',
    example: 'Una persona es celíaca.',
  })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiPropertyOptional({
    description: 'Indica si se requiere emisión de Factura A',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requiredBill?: boolean;

  @ApiPropertyOptional({
    description: 'Razón Social para emisión de Factura A',
    example: 'Nómada Picnic S.R.L.',
  })
  @IsString()
  @IsOptional()
  socialName?: string;

  @ApiPropertyOptional({
    description: 'CUIT de facturación en formato XX-XXXXXXXX-X',
    example: '20-19110527-6',
  })
  @IsString()
  @IsOptional()
  // @Matches(/^\d{2}-\d{8}-\d{1}$/)
  cuit?: string;

  @ApiPropertyOptional({
    description: 'Condición frente al IVA para Factura A',
    example: 'Responsable Inscripto',
  })
  @IsString()
  @IsOptional()
  ivaCondition?: string;

  @ApiProperty({
    description: 'Aceptación de términos y condiciones generales',
    example: true,
  })
  @IsBoolean()
  tyc: boolean;

  @ApiProperty({
    description: 'Aceptación de políticas de cancelación y reprogramación',
    example: true,
  })
  @IsBoolean()
  policy: boolean;
}

export class CreatePicnicDto {
  @ApiProperty({
    description: 'Información y configuración del picnic reservado',
    type: PicnicBookingDto,
  })
  @ValidateNested()
  @Type(() => PicnicBookingDto)
  @IsNotEmpty()
  booking: PicnicBookingDto;

  @ApiProperty({
    description: 'Lista de ítems adicionales seleccionados',
    type: [CartAdditionalDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartAdditionalDto)
  additionals: CartAdditionalDto[];

  @ApiProperty({
    description: 'Datos personales y preferencias del cliente',
    type: PicnicClientInfoDto,
  })
  @ValidateNested()
  @Type(() => PicnicClientInfoDto)
  @IsNotEmpty()
  clientInfo: PicnicClientInfoDto;
}