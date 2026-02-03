import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Place extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: { lat: String, lng: String } })
  location: { lat: string; lng: string };

  @Prop()
  mapsLink: string;

  @Prop()
  zone: number;

  @Prop()
  transportationCost: number;
}

export const PlacesSchema = SchemaFactory.createForClass(Place);