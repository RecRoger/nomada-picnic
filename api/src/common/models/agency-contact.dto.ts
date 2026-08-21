import { ApiProperty } from '@nestjs/swagger';
import { IAgencyContact, IPicnicPackage } from '@shared/interfaces';
import {
  IsArray,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';

export class AgencyContactDto implements IAgencyContact {
  @IsString({ message: 'El nombre debe ser un texto' })
  @ApiProperty({
    required: true,
    description: 'Nombre del contacto de agencia',
    example: 'Maria Gonzalez'
  })
  fullName: string

  @IsString({ message: 'El Nombre de la compañia debe ser texto' })
  @ApiProperty({
    required: true,
    description: 'Nombre de la compañia',
    example: 'Turismo de altura'
  })
  company: string

  @IsString({ message: 'El email debe ser texto' })
  @ApiProperty({
    required: true,
    description: 'Email de contacto',
    example: 'altura@turismo.com'
  })
  email: string

  @IsString({ message: 'El telefono debe ser texto' })
  @ApiProperty({
    required: true,
    description: 'Telefono de contacto',
    example: '+54 9 11 6161 3535'
  })
  phone: string

  @IsString({ message: 'El tipo de cliente debe ser texto' })
  @ApiProperty({
    required: true,
    description: 'Tipo de cliente',
    example: 'TOURISM'
  })
  clientType: string

  @IsString({ message: 'El tipo de evento debe ser texto' })
  @ApiProperty({
    required: true,
    description: 'Tipo de evento',
    example: 'TOURISM'
  })
  eventType: string

  @IsString({ message: 'La cantidad de invitados debe ser texto' })
  @ApiProperty({
    required: true,
    description: 'Cantidad de personas aproximada',
    example: 'TOURISM'
  })
  guestsRange: string

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Fecha estimada para el evento',
    example: '10/10/2030'
  })
  eventDate: Date | string

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Hora estimada del evento',
    example: '11:14'
  })
  eventTime: string

  @IsString({ message: 'El tipo de lugar elegido debe ser texto' })
  @ApiProperty({
    required: true,
    description: 'Eleccion de lugar (Particular o recommended)',
    example: 'TOURISM'
  })
  placeChoice: string

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Lugar particular solicitado',
    example: 'TOURISM'
  })
  ownPlace: string

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    required: false,
    default: [],
    description: 'Servicios',
    example: ['FULL', 'CATERING']
  })
  services: string[]

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Presupuesto estimado para el evento',
    example: '1000USD'
  })
  budget: string

  @IsString({ message: 'los comentarios deben ser un string' })
  @ApiProperty({
    required: true,
    description: 'Comentarios generales',
    example: 'comentarios generales del picnic'
  })
  comments: string
}