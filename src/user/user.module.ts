import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { CodeAlreadyConfirmed, UserExistsValidation } from '../validation/validation';
import { TokenModule } from '../tokens/tokens.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), TokenModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserExistsValidation, CodeAlreadyConfirmed],
  exports: [UsersService, UserRepository],
})
export class UserModule {}
