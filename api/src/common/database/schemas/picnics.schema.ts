import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BookingStatus } from '@shared/enums';
import { Document, Types } from 'mongoose';

export type PicnicsDocument = Picnic & Document;

@Schema({ timestamps: true })
export class Picnic {
  // Información de la experiencia
  @Prop({ type: Types.ObjectId, ref: 'PicnicPackage', required: true })
  package: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PicnicEvent' })
  event?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Place' })
  place?: Types.ObjectId;

  @Prop({ required: true })
  minGuest: number;

  @Prop({ required: true })
  maxGuest: number;

  @Prop({ required: true })
  eventDate: Date;

  @Prop({ required: true })
  eventTime: string;

  @Prop({ required: true })
  basePrice: number;

  // Adicionales seleccionados (subdocumento)
  @Prop([
    {
      cost: { type: Types.ObjectId, ref: 'Cost', required: true },
      unitPrice: { type: Number },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ])
  additionals: {
    cost: Types.ObjectId;
    unitPrice?: number;
    quantity: number;
    totalPrice: number;
  }[];

  // Datos del cliente
  @Prop({
    type: {
      name: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      boardMessage: String,
      giftDrinks: [String],
      honoredName: String,
      comments: String,
      requiredBill: { type: Boolean, default: false },
      socialName: String,
      cuit: String,
      ivaCondition: String,
      tyc: { type: Boolean, required: true },
      policy: { type: Boolean, required: true },
    },
    required: true,
  })
  clientInfo: Record<string, any>;

  // Totales y estado del pago
  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  // Referencias para pasarela de pago (Mercado Pago)
  @Prop()
  preferenceId?: string;

  @Prop()
  paymentId?: string;
}

export const PicnicsSchema = SchemaFactory.createForClass(Picnic);