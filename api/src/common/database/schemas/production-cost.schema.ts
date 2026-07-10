import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type CostDocument = HydratedDocument<Cost>;

@Schema({
  timestamps: true,
  collection: 'costs',
})
export class Cost {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  detail: string;

  @Prop({ required: true })
  providerCost: number;

  @Prop({ required: true })
  productionCost: number;

  @Prop()
  earnPercentage: number;

  @Prop({ required: true })
  finalPrice: number;

  @Prop()
  guestsCoverage: number;

  @Prop()
  multipleAllowed: boolean;

  @Prop()
  deliveryRequired: boolean;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ type: [String], default: [] })
  tags?: string[];
}

export const ProductionCostsSchema = SchemaFactory.createForClass(Cost);