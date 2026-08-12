import { ApiProperty } from '@nestjs/swagger';
import { IPicnicEvent } from '@shared/interfaces';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsBoolean
} from 'class-validator';

export class PicnicEventDto implements IPicnicEvent {
  @IsString({ message: 'El nombre debe ser un texto' })
  @ApiProperty({
    required: true,
    description: 'Nombre del tipo de evento del picnic',
    example: 'Romántico'
  })
  name: string;

  @IsString({ message: 'El Icono debe ser un texto' })
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Icono del tipo de evento',
  })
  icon: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Cada ID de costo de producción debe ser un texto' })
  @ApiProperty({
    required: false,
    isArray: true,
    description: 'Lista de IDs de los costos de adicionales recomendados a este tipo de picnic',
    example: ['66b2a123f8e4c91012345678', '66b2a987f8e4c91087654321']
  })
  recomendedAditionals?: string[];
}