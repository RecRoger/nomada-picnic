import { ApiProperty } from '@nestjs/swagger';
import { IExpense, IExpenseValue } from '@shared/interfaces';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ExpenseDto implements IExpense {
  @IsString({ message: 'El nombre debe ser un texto' })
  @ApiProperty({ description: 'Nombre del gasto' })
  name: string

  @IsNumber()
  @ApiProperty({ description: 'Costo del gasto' })
  cost: number;

  @IsBoolean()
  @ApiProperty({ description: 'Indicador de Gasto recurrente mensual' })
  monthly?: boolean

  @IsNumber()
  @ApiProperty({ description: 'Número de Meses para amortizar gasto' })
  amortization?: number;
}

export class ExpenseValueDto implements IExpenseValue {
  @IsNumber()
  @ApiProperty({ description: 'Valor de Gastos mensuales' })
  monthlyValue?: number;

  @IsNumber()
  @ApiProperty({ description: 'Valor total de gastos de inversion' })
  toBeAmortized?: number;

  @IsNumber()
  @ApiProperty({ description: 'Valor mensual de amortizacion de inversiones' })
  amortizedValue?: number;

  @IsNumber()
  @ApiProperty({ description: 'Valor total de gastos (mensual + amortizacion)' })
  totalValue: number;

  @IsNumber()
  @ApiProperty({ description: 'Porcentage de pago de amortizacion total' })
  amortizationPercentage?: number;

  @IsNumber()
  @ApiProperty({ description: 'Porcentage del gasto total mensual' })
  percentage?: number;
}