import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true, // Crea 'createdAt' y 'updatedAt' automáticamente
  collection: 'users', // Opcional: fuerza el nombre de la colección
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true, // Evita emails duplicados en la BD
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);
