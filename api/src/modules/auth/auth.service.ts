import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { User, UsersDocument } from 'src/common/database/schemas/users.schema';
import { UserDto } from 'src/common/models/user.dto';

@Injectable()
export class AuthService {
  private readonly SECRET_PASSWORD = 'ultrasecret'
  private readonly logger = new Logger(AuthService.name)

  constructor(@InjectModel(User.name) private usersModel: Model<UsersDocument>) { }

  private hideUser(user: UserDto): UserDto {
    this.logger.log('[hideUser]')
    const { email, name } = user
    return { email, name } as UserDto
  }

  private transformPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex')
  }

  async validate(email?: string, password?: string, ultrasecret?: string): Promise<UserDto> {
    this.logger.log('[validate]', email)
    if (ultrasecret !== this.SECRET_PASSWORD) {
      this.logger.error(`no secret`, AuthService.name);
      throw new ForbiddenException('No Secrets');
    }
    const userQuery = await this.usersModel.findOne({ email }).exec();
    const user = userQuery as unknown as UserDto;
    if (user) {
      this.logger.log('[fund one]', user?.name)
      const hashedPassword = this.transformPassword(password);
      if (hashedPassword === user.password) {
        return this.hideUser(user);
      }
    }
    this.logger.warn('[not fund]')
    return null;
  }


  async create(user: UserDto): Promise<User> {
    this.logger.log('[create] - ', user.email)

    if (user._id !== this.SECRET_PASSWORD) {
      this.logger.error(`no secret`, AuthService.name);
      throw new ForbiddenException('Error al crear el user');
    }
    const newUser = { ...user, _id: undefined, password: this.transformPassword(user.password) }
    const createdUser = new this.usersModel(newUser);
    try {

      const newUser = (await createdUser.save()) as unknown as UserDto;
      this.logger.log('[created]', newUser.name)
      return this.hideUser(newUser);
    } catch (err) {
      this.logger.error(`Error user: ${err.message}`, err.stack, AuthService.name);
      throw new Error('Error al crear el user');
    }
  }

  async update(id: string, updateUserData: UserDto): Promise<User> {
    this.logger.log('[update]', id)
    const edited = await this.usersModel.findByIdAndUpdate(id, {
      ...updateUserData,
      ...(updateUserData.password ? { password: this.transformPassword(updateUserData.password) } : {})
    }, { new: true }).exec();
    const editedUser = edited as unknown as UserDto;
    this.logger.log('[updated]')
    return this.hideUser(editedUser)
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.usersModel.findByIdAndDelete(id).exec();
    this.logger.log(`[removed]`,)
    return true
  }
}
