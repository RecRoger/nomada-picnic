import { ApiProperty } from '@nestjs/swagger';
import { IPicnicPackage } from '@shared/interfaces';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsBoolean
} from 'class-validator';

export class PicnicPackageDto implements IPicnicPackage {
  @IsString({ message: 'El nombre debe ser un texto' })
  @ApiProperty({
    required: true,
    description: 'Nombre del paquete de picnic',
    example: 'Picnic Romántico '
  })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @ApiProperty({
    required: true,
    description: 'Descripción corta del paquete',
  })
  description: string;

  @IsString({ message: 'El detalle debe ser un texto' })
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Descripción detallada del paquete',
    example: 'Una experiencia íntima ambientada con luces cálidas y pastelería fina.'
  })
  detail?: string;

  @IsString({ message: 'El tag debe ser un texto' })
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Tag informativo para el paquete',
    example: 'Mas vendido'
  })
  tag?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'URL o path de la imagen principal del paquete',
  })
  image?: string;

  @IsNumber({}, { message: 'El número mínimo de invitados debe ser un número' })
  @Min(1, { message: 'Debe permitir al menos 1 invitado' })
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Minimo numero de invitados permitidos para este paquete',
    example: 2
  })
  minGuests?: number;

  @IsNumber({}, { message: 'El número máximo de invitados debe ser un número' })
  @Min(2, { message: 'Debe permitir al menos 1 invitado' })
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Límite máximo de invitados permitidos para este paquete',
    example: 10
  })
  maxGuests?: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Cada elemento incluido debe ser un texto' })
  @ApiProperty({
    required: false,
    isArray: true,
    description: 'Lista de elementos o ítems incluidos en el paquete',
    example: ['Mesa de madera baja', 'Cojines decorativos', 'Vajilla completa', 'Cesta de mimbre']
  })
  includedItems?: string[] = [];

  @IsNumber({}, { message: 'El porcentaje de ganancia debe ser un número' })
  @Min(0, { message: 'El porcentaje de ganancia no puede ser negativo' })
  @Max(100, { message: 'El porcentaje no puede ser mayor a 100' })
  @ApiProperty({
    required: false,
    description: 'Porcentaje de ganancia aplicable al paquete',
    example: 35
  })
  profitPercent?: number;

  @IsNumber({}, { message: 'El porcentaje de gastos generales debe ser un número' })
  @Min(0, { message: 'El porcentaje de gastos no puede ser negativo' })
  @Max(100, { message: 'El porcentaje no puede ser mayor a 100' })
  @ApiProperty({
    required: false,
    description: 'Porcentaje destinado a cubrir gastos generales (OPEX)',
    example: 15
  })
  expensesPercent?: number;

  @IsNumber({}, { message: 'El porcentaje de gastos grande generales debe ser un número' })
  @Min(0, { message: 'El porcentaje de gastos grandes no puede ser negativo' })
  @Max(100, { message: 'El porcentaje no puede ser mayor a 100' })
  @ApiProperty({
    required: false,
    description: 'Porcentaje destinado a cubrir gastos generales (OPEX) a partir de picnics grandes',
    example: 15
  })
  bigExpensesPercent?: number;

  @IsArray()
  @IsString({ each: true, message: 'Cada ID de costo de producción debe ser un texto' })
  @ApiProperty({
    required: false,
    isArray: true,
    description: 'Lista de IDs de los costos de producción que aplican a este paquete',
    example: ['66b2a123f8e4c91012345678', '66b2a987f8e4c91087654321']
  })
  productionCostIds?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'El costo base debe ser un número' })
  @ApiProperty({
    required: false,
    description: 'Costo para minima cantidad de invitados',
    example: 40
  })
  baseCost?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio minimo debe ser un número' })
  @ApiProperty({
    required: false,
    description: 'Precio para minima cantidad de invitados',
    example: 70
  })
  minPrice?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    required: false,
    description: 'Aumenta el costo del transporte para picnics grandes',
    example: 70
  })
  extraTransport?: number;
}