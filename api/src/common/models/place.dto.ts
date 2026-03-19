import { ApiProperty } from '@nestjs/swagger';
import { PlacesTypes } from '@shared/enums';
import { IPlace } from '@shared/interfaces';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
  IsUrl,
} from 'class-validator';

export class PlaceDto implements IPlace {
  @IsString({ message: 'El nombre debe ser un texto' })
  @ApiProperty({ required: true, description: 'Nombre descriptivo del lugar', example: 'Lago de regatas' })
  name: string;

  @IsEnum(PlacesTypes, { message: 'El tipo de lugar no es válido' })
  @IsOptional()
  @ApiProperty({ required: true, description: 'Tipo de lugar', example: 'public', enum: PlacesTypes })
  type: PlacesTypes;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Descripcion corta del parque', example: 'Un Hermoso parque' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Html envevible al detalle del parque', example: 'Bla Bla <b>Bla</b>' })
  detail?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ required: false, isArray: true, description: 'links y urls de archivos de fotos del lugar', example: [] })
  images?: string[];

  @IsObject()
  @IsOptional()
  @ApiProperty({ description: 'Coordenadas de ubicacion en maps', example: '' })
  location?: { lat: number; lng: number };

  @IsUrl()
  @IsOptional()
  @ApiProperty({ description: 'Link de maps', example: 'https://maps.app.goo.gl/jhryd4nUcJVGVYL27' })
  mapsLink?: string;

  @IsNumber()
  @ApiProperty({ description: 'Zona del Lugar (0 para zonas básicas de precios)', example: 1 })
  zone: number;

  @IsNumber()
  @ApiProperty({ description: 'Costo del transporte', example: 20 })
  transportationCost: number;
}
