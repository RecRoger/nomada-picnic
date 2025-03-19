import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Provider extends Document {
  @Prop()
  nombre: string;

  @Prop()
  descripcion: string;

}

export const ProvidersSchema = SchemaFactory.createForClass(Provider);