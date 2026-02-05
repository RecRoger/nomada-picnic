
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
  name: string;

  @IsEnum(PlacesTypes, { message: 'El tipo de lugar no es válido' })
  type: PlacesTypes;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];

  @IsObject()
  location: { lat: number; lng: number };

  @IsOptional()
  @IsUrl()
  mapsLink?: string;

  @IsNumber()
  zone: number;

  @IsNumber()
  transportationCost: number;
}
