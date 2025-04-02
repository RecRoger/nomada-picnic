import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from 'server/database/schemas/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
