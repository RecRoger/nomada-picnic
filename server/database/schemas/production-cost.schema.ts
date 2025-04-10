import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cost extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

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
  deliveryRequired: boolean;

  @Prop([String])
  images?: string[];
}

export const ProductionCostsSchema = SchemaFactory.createForClass(Cost);