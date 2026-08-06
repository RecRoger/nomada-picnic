import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PicnicPackageDocument = HydratedDocument<PicnicPackage>;

@Schema({
  timestamps: true,
  collection: 'packages',
})
export class PicnicPackage {
  @Prop({
    type: String,
    required: [true, 'El nombre del paquete es obligatorio'],
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
  })
  description: string;

  @Prop({
    type: String,
    trim: true,
  })
  detail: string;

  @Prop({
    type: String,
    trim: true,
  })
  tag: string;

  @Prop({
    type: String,
    default: null,
  })
  image?: string;

  @Prop({
    type: Number,
    default: 1,
  })
  minGuests?: number;

  @Prop({
    type: Number,
    default: null,
  })
  maxGuests?: number;

  @Prop({
    type: [String],
    default: [],
  })
  includedItems?: string[];

  @Prop({
    type: Number,
    required: [true, 'El porcentaje de ganancia es obligatorio'],
    min: [0, 'El porcentaje no puede ser menor a 0'],
    max: [100, 'El porcentaje no puede ser mayor a 100'],
  })
  profitPercent: number;

  @Prop({
    type: Number,
    required: [true, 'El porcentaje de gastos generales es obligatorio'],
    min: [0, 'El porcentaje no puede ser menor a 0'],
    max: [100, 'El porcentaje no puede ser mayor a 100'],
  })
  expensesPercent: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Cost' }],
    required: true,
    default: [],
  })
  productionCostIds: Types.ObjectId[];
}

export const PicnicPackageSchema = SchemaFactory.createForClass(PicnicPackage);