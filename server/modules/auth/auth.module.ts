import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from 'server/database/schemas/users.schema';
import { AuthController } from 'server/modules/auth/auth.controller';
import { AuthService } from 'server/modules/auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
