import { ApiProperty } from '@nestjs/swagger';
import { CostsTypes } from '@shared/enums';
import { ICost } from '@shared/interfaces';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CostDto implements ICost {
  @IsString({ message: 'El nombre debe ser un texto' })
  @ApiProperty({ required: true, description: 'Nombre del costo', example: 'Armado de picnic' })
  name: string;


  @IsEnum(CostsTypes, { message: 'Tipo de costo (production, additional, food)' })
  @IsOptional()
  @ApiProperty({ required: true, description: 'Tipo de costo (production, additional, food)', example: 'additional', enum: CostsTypes })
  type: CostsTypes

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Descripcion del costo', example: 'Costo referente a armado de picnic en el lugar del evento' })
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ required: false, isArray: true, description: 'links y urls de archivos de imagenes del costo', example: [] })
  images?: string[] = []

  @IsNumber()
  @ApiProperty({ description: 'Costo del producto o servicio', example: 15 })
  providerCost?: number;

  @IsNumber()
  @ApiProperty({ description: 'Pago al productor encargado', example: 5 })
  productionCost?: number;

  @IsNumber()
  @ApiProperty({ description: 'Porcentaje de ganancia por producto/servicio', example: 10 })
  earnPercentage?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Precio final (costo + produccion + ganacia%)', example: 28 })
  finalPrice?: number;

  @IsNumber()
  @ApiProperty({ description: 'Numero de clientes que abarca el costo', example: 6 })
  guestsCoverage?: number;

  @IsBoolean()
  @ApiProperty({ description: 'Indicador si permite seleccion de varios' })
  multipleAllowed?: boolean;

  @IsBoolean()
  @ApiProperty({ description: 'Indicador de delivery de comida' })
  deliveryRequired?: boolean;
}