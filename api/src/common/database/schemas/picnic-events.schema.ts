import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PicnicEventDocument = HydratedDocument<PicnicEvent>;

@Schema({
  timestamps: true,
  collection: 'events',
})
export class PicnicEvent {
  @Prop({
    type: String,
    required: [true, 'El nombre del tipo de evento es obligatorio'],
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
  })
  icon: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Cost' }],
    required: true,
    default: [],
  })
  recomendedAditionals: Types.ObjectId[];
}

export const PicnicEventSchema = SchemaFactory.createForClass(PicnicEvent);