import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Expense extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cost: number;

  @Prop()
  monthly: boolean;

  @Prop()
  amortization: number;

  @Prop({ required: true })
  expenseDate: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);