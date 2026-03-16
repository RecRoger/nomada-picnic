import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseDto, ExpenseValueDto } from 'src/common/models/expense.dto';
import { Expense, ExpenseDocument } from 'src/database/schemas/expenses.schema';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name)

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) { }

  async findAll(): Promise<Expense[]> {
    this.logger.log('[findAll]')
    return this.expenseModel.find().exec();
  }

  async getExpenses(guestsAmount?: number, percentage?: number): Promise<ExpenseValueDto> {
    this.logger.log(`[getExpenses] ${!guestsAmount && !percentage ? `Total` : ''} ${guestsAmount ? `Guests: ${guestsAmount}` : ''} ${percentage ? `${percentage}%` : ''}`)
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


    if (guestsAmount) {
      const newPercentage = this.calculateExpensePercentage(guestsAmount)
      this.logger.log(`[getExpenses] ${guestsAmount} invitados: ${newPercentage}%`)
      expenseValue.totalValue = expenseValue.totalValue * newPercentage
      expenseValue.percentage = newPercentage * 100
    } else {
      expenseValue.totalValue = expenseValue.totalValue * expenseValue.percentage / 100
      this.logger.log(`[getExpenses] ${expenseValue.percentage}% es USD${expenseValue.totalValue}`)
    }

    if (guestsAmount || expenseValue.percentage != 100) {
      expenseValue.monthlyValue = undefined
      expenseValue.toBeAmortized = undefined
      expenseValue.amortizedValue = undefined
      expenseValue.amortizationPercentage = undefined
    }

    return expenseValue
  }

  async create(expenseData: ExpenseDto): Promise<Expense> {
    this.logger.log('[create] - ', expenseData.name)
    try {
      const createdCost = new this.expenseModel({ ...expenseData, expenseDate: new Date() });
      return await createdCost.save();
    } catch (err) {
      this.logger.error(`Error creating expense: ${err.message}`, err.stack, ExpensesService.name);
      throw new Error('Error al crear el costo de producción');
    }
  }

  async update(id: string, costData: ExpenseDto): Promise<Expense> {
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

  /**
   * Calcula un porcentaje de gasto total basado en el número de invitados,
   * con un comportamiento exponencial dentro de un rango definido.
   *
   * @param numGuests El número de invitados (entre 2 y 30).
   * @param exponent (Opcional) El factor de curvatura de la función exponencial.
   * - Un valor > 1 (ej. 2) hace que el porcentaje crezca más rápido hacia el final.
   * - Un valor = 1 (lineal)
   * - Un valor < 1 (ej. 0.5) hace que el porcentaje crezca más rápido al principio.
   * Por defecto, 2.0 para un comportamiento cuadrático suave.
   **/
  private calculateExpensePercentage(numGuests: number, exponent: number = 2.0): number {
    this.logger.log(`[calculateExpensePercentage] Guests ${numGuests} al factor ${exponent}`)
    const MIN_GUESTS = 2;
    const MAX_GUESTS = 30;
    const MIN_PERCENTAGE = 0.15; // 15%
    const MAX_PERCENTAGE = 0.75; // 75%

    // 1. Validar el número de invitados
    if (numGuests < MIN_GUESTS || numGuests > MAX_GUESTS) {
      this.logger.warn(`Número de invitados (${numGuests}) fuera del rango permitido [${MIN_GUESTS}, ${MAX_GUESTS}]. 
                  El cálculo puede no ser exacto o se ajustará a los límites.`);
      // Opcional: Clampear el valor a los límites si está fuera de rango.
      numGuests = Math.max(MIN_GUESTS, Math.min(numGuests, MAX_GUESTS));
    }
    // 2. Normalizar el número de invitados a un rango de [0, 1]
    const normalizedGuests = (numGuests - MIN_GUESTS) / (MAX_GUESTS - MIN_GUESTS);
    // 3. Aplicar la función exponencial (potencia)
    const exponentialFactor = Math.pow(normalizedGuests, exponent);
    // 4. Desnormalizar al rango de porcentaje final [MIN_PERCENTAGE, MAX_PERCENTAGE]
    const finalPercentage = MIN_PERCENTAGE + (MAX_PERCENTAGE - MIN_PERCENTAGE) * exponentialFactor;
    // Asegurar que el porcentaje esté dentro de los límites esperados (por si acaso con floats)
    return Math.max(MIN_PERCENTAGE, Math.min(finalPercentage, MAX_PERCENTAGE));
  }
}
