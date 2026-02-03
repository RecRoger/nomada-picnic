export interface ExpenseDto {
  _id?: string;
  name: string;
  cost: number;
  monthly?: boolean;
  amortization?: number;
  expenseDate?: string;
}

export interface ExpenseValueDto {
  monthlyValue?: number;
  toBeAmortized?: number;
  amortizedValue?: number;
  totalValue: number;
  amortizationPercentage?: number;
  percentage?: number;
}