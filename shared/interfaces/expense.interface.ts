export interface IExpense {
  _id?: string;
  name: string
  cost: number;
  monthly?: boolean
  amortization?: number;
  expenseDate?: Date;
}

export interface IExpenseValue {
  monthlyValue?: number;
  toBeAmortized?: number;
  amortizedValue?: number;
  totalValue: number;
  amortizationPercentage?: number;
  percentage?: number;
}