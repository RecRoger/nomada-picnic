import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({
  timestamps: true,
  collection: 'expenses',
})
export class Expense {
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