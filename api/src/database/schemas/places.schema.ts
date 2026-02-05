import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// import { IPlace } from '@shared'; // Descomenta cuando tengas la interfaz en shared

export type PlacesDocument = HydratedDocument<Place>;

@Schema({
  timestamps: true,
  collection: 'places',
})
export class Place {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, index: true }) // Indexado para filtros rápidos
  type: string;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    _id: false, // Evita que Mongoose cree un ID interno para este objeto anidado
  })
  location: { lat: number; lng: number };

  @Prop({ trim: true })
  mapsLink: string;

  @Prop({ type: Number, index: true })
  zone: number;

  @Prop({ type: Number, default: 0 })
  transportationCost: number;
}

export const PlacesSchema = SchemaFactory.createForClass(Place);
