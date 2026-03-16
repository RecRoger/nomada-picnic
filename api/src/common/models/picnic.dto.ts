import { ApiProperty } from '@nestjs/swagger';


export class PicnicClient {
  @ApiProperty({ description: 'Nombre del Cliente' })
  name: string;

  @ApiProperty({ description: 'Email del Cliente' })
  email: string;

  @ApiProperty({ description: 'Telefono del Cliente' })
  phone: string;
}

export class NewPlace {
  @ApiProperty({ description: 'Nueva direccion' })
  address: string;

  @ApiProperty({ description: 'Numero de zona' })
  zone: string;
}

export class PicnicEvent {
  @ApiProperty({ description: 'Descripcion del evento' })
  description: string;

  @ApiProperty({ description: 'Numero de invitados' })
  guestsAmount: number;

  @ApiProperty({ description: 'Fecha del evento' })
  date: Date;

  @ApiProperty({ description: 'Horas extras' })
  extraHours?: number;

  @ApiProperty({ description: 'id del lugar del picnic' })
  place: string

  @ApiProperty({ description: 'Descripcion nuevo lugar' })
  newPlace?: NewPlace

  @ApiProperty({ description: 'Cantidad de mesas' })
  boardText: string;
}

export class ProductionCost {
  @ApiProperty({ description: 'Costo de produccion' })
  productionCost: number;

  @ApiProperty({ description: 'Costo de Transporte' })
  transportationCost: number;

  @ApiProperty({ description: 'Costo de Cortesia' })
  giftCost: number;
}

export class AdditionalItem {
  @ApiProperty({ description: 'Id de costo' })
  item: string;

  @ApiProperty({ description: 'Cantidad solicitada' })
  amount: number
}

export class PicnicProduction {
  @ApiProperty({ description: 'Indicador Promocional' })
  promoIndicator?: boolean;

  @ApiProperty({ description: 'Cantidad de mantas' })
  blanketsAmount: number;

  @ApiProperty({ description: 'Cantidad de mesas' })
  tableAmount: number;

  @ApiProperty({ description: 'Indicador de mesón' })
  bigTableIndicator?: boolean;

  @ApiProperty({ description: 'Indicador de Arco' })
  archIndicator?: boolean;

  @ApiProperty({ description: 'Regalos de cortecía' })
  gifts: AdditionalItem[];

  @ApiProperty({ description: 'Costos de producción' })
  basicCost: ProductionCost;

  @ApiProperty({ description: 'Porcentaje de ganancia' })
  basicEarnPercentage?: number;

  @ApiProperty({ description: 'Precio total' })
  basicPrice?: number;
}

export class PicnicAdditionals {
  @ApiProperty({ description: 'Lista de adicionales' })
  items: AdditionalItem[];

  @ApiProperty({ description: 'Costo de adicionales' })
  additionalCost: number;

  @ApiProperty({ description: 'Porcentage de ganancia de adicionales' })
  additionalEarnPercentage?: number;

  @ApiProperty({ description: 'Precio de adicionales' })
  additionalPrice: number;
}

export class PicnicFood {
  @ApiProperty({ description: 'Lista de comidas' })
  foods: AdditionalItem[];

  @ApiProperty({ description: 'Costo de toda la comida' })
  foodCost: number;

  @ApiProperty({ description: 'Porcentage de ganancia por la comida' })
  foodEarnPercentage?: number;

  @ApiProperty({ description: 'Precio total de la comida' })
  foodPrice: number;
}

export class PicnicDto {
  @ApiProperty({ description: 'id del picnic' })
  _id?: string;

  @ApiProperty({ description: 'Cliente del picnic' })
  client: PicnicClient;

  @ApiProperty({ description: 'Informacion del evento' })
  event: PicnicEvent;

  @ApiProperty({ description: 'Informacion de produccion' })
  basicProduction: PicnicProduction;

  @ApiProperty({ description: 'Adicionales' })
  additionals?: PicnicAdditionals;

  @ApiProperty({ description: 'Comida' })
  food?: PicnicFood;
}