import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Picnic extends Document {
  @Prop()
  nombre: string;

  @Prop()
  descripcion: string;

}

export const PicnicsSchema = SchemaFactory.createForClass(Picnic);