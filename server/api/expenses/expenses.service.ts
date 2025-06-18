import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from 'server/database/schemas/expenses.schema';
import { CostDto } from 'server/models/cost.dto';
import { ExpenseValueDto } from 'server/models/expense.dto';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name)

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) { }

  async findAll(): Promise<Expense[]> {
    this.logger.log('[findAll]')
    return this.expenseModel.find().exec();
  }

  async getExpenses(guestsAmount?: number, percentage?: number): Promise<ExpenseValueDto> {
    this.logger.log(`[getExpenses] ${!guestsAmount && !percentage ? `total` : ''} ${guestsAmount ? `guests: ${guestsAmount}` : ''} ${percentage ? `${percentage}%` : ''}` + ' ' + percentage)
    const expenses = await this.expenseModel.find().exec();
    const expenseValue = expenses.reduce(
      (total, expense: Expense) => ({
        ...total,
        monthlyValue: total.monthlyValue + (expense.monthly ? Number(expense.cost) : 0),
        toBeAmortized: total.toBeAmortized + (!expense.monthly && expense.amortization ? Number(expense.cost) : 0),
        amortizedValue: total.amortizedValue + (!expense.monthly && expense.amortization ? Number(expense.cost) / Number(expense.amortization) : 0),
      }),
      { monthlyValue: 0, totalValue: 0, toBeAmortized: 0, amortizedValue: 0, amortizationPercentage: 0, percentage: percentage || 100 }
    )

    expenseValue.totalValue = expenseValue.monthlyValue + expenseValue.amortizedValue
    expenseValue.amortizationPercentage = expenseValue.amortizedValue * 100 / expenseValue.toBeAmortized
    return expenseValue
  }

  async create(expenseData: CostDto): Promise<Expense> {
    this.logger.log('[create] - ', expenseData.name)
    try {
      const createdCost = new this.expenseModel({ ...expenseData, expenseDate: new Date() });
      return await createdCost.save();
    } catch (err) {
      this.logger.error(`Error creating expense: ${err.message}`, err.stack, ExpensesService.name);
      throw new Error('Error al crear el costo de producción');
    }
  }

  async update(id: string, costData: CostDto): Promise<Expense> {
    this.logger.log(`[update] - ${id}`,)
    try {
      return this.expenseModel.findByIdAndUpdate(id, costData, { new: true }).exec();
    } catch (err) {
      this.logger.error(`Error editing expense: ${err.message}`, err.stack, ExpensesService.name);
      throw new Error('Error al actualizar el costo de producción');
    }
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.expenseModel.findByIdAndDelete(id).exec();
    return true
  }
}
