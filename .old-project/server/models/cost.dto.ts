import { ApiProperty } from '@nestjs/swagger';
import { COSTS_TYPES } from 'server/enums/costs-types.enum';

export class CostDto {
  @ApiProperty({ description: 'id del costo' })
  _id?: string;

  @ApiProperty({ description: 'Nombre del costo' })
  name: string;

  @ApiProperty({ description: 'Tipo de costo (production, additional, food)' })
  type: COSTS_TYPES

  @ApiProperty({ description: 'Descripción de costo' })
  description: string;

  @ApiProperty({ description: 'Imágenes del producto' })
  images?: string[] = []

  @ApiProperty({ description: 'Costo del producto o servicio' })
  providerCost?: number;

  @ApiProperty({ description: 'Pago al productor encargado' })
  productionCost?: number;

  @ApiProperty({ description: 'Porcentaje de ganancia por producto/servicio' })
  earnPercentage?: number;

  @ApiProperty({ description: 'Precio final (costo + produccion + ganacia%)' })
  finalPrice?: number;

  @ApiProperty({ description: 'Numero de clientes que abarca el costo' })
  guestsCoverage?: number;

  @ApiProperty({ description: 'Indicador si permite seleccion de varios' })
  multipleAllowed?: boolean;

  @ApiProperty({ description: 'Indicador de delivery de comida' })
  deliveryRequired?: boolean;
}