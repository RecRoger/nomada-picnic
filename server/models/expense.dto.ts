import { ApiProperty } from '@nestjs/swagger';

export class ExpenseDto {
  @ApiProperty({ description: 'id del Gasto' })
  _id?: string;

  @ApiProperty({ description: 'Nombre del gasto' })
  name: string

  @ApiProperty({ description: 'Costo del gasto' })
  cost: number;

  @ApiProperty({ description: 'Indicador de Gasto recurrente mensual' })
  monthly?: boolean

  @ApiProperty({ description: 'Número de Meses para amortizar gasto' })
  amortization?: number;

  @ApiProperty({ description: 'Fecha de creacion del gasto' })
  expenseDate?: Date;
}

export class ExpenseValueDto {
  @ApiProperty({ description: 'Valor de Gastos mensuales' })
  monthlyValue: number;

  @ApiProperty({ description: 'Valor total de gastos de inversion' })
  toBeAmortized?: number;

  @ApiProperty({ description: 'Valor mensual de amortizacion de inversiones' })
  amortizedValue?: number;

  @ApiProperty({ description: 'Valor total de gastos (mensual + amortizacion)' })
  totalValue: number;

  @ApiProperty({ description: 'Porcentage de pago de amortizacion total' })
  amortizationPercentage?: number;

  @ApiProperty({ description: 'Porcentage del gasto total mensual' })
  percentage?: number;
}