import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UsersSchema } from 'src/database/schemas/users.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
