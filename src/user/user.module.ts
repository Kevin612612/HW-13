import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './users.schema';
import { UserRepository } from './users.repository';
import { UserExistsValidation } from '../validation/validation';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { TokenModule } from '../tokens/tokens.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), TokenModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserExistsValidation],
  exports: [UsersService, UserRepository],
})
export class UserModule {}
