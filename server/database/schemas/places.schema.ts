import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Place extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop([String])
  images: string[];

  @Prop({ type: { lat: String, long: String } })
  location: { lat: string; long: string };

  @Prop()
  mapsLink: string;

  @Prop()
  transportationCost: number;
}

export const PlacesSchema = SchemaFactory.createForClass(Place);