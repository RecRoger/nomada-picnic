import { ApiProperty } from '@nestjs/swagger';
import { PlacesTypes } from 'server/enums/places.enum';

export class PlaceLocation {
  @ApiProperty({ description: 'Latitud' })
  lat: number

  @ApiProperty({ description: 'Longitud' })
  lng: number
}

export class PlaceDto {
  @ApiProperty({ description: 'id del lugar' })
  _id?: string;

  @ApiProperty({ description: 'Nombre del lugar' })
  name: string;

  @ApiProperty({ description: 'Tipo del lugar (public, particular)' })
  type: PlacesTypes = PlacesTypes.PUBLIC

  @ApiProperty({ description: 'Descripción del lugar' })
  description: string;

  @ApiProperty({ description: 'Imágenes del lugar (array de URLs)' })
  images: string[] = []

  @ApiProperty({ description: 'Ubicación del lugar (latitud y longitud)' })
  location?: PlaceLocation;

  @ApiProperty({ description: 'Enlace a Google Maps' })
  mapsLink: string;

  @ApiProperty({ description: 'Numero de Zona (del 0 al 4)' })
  zone?: number;

  @ApiProperty({ description: 'Costo de transporte al lugar' })
  transportationCost: number;
}