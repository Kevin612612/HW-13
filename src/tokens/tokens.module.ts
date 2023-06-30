import { Module } from '@nestjs/common';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema } from './refreshtoken.schema';
import { RefreshTokenService } from './refreshtoken.service';
import { AccessTokenService } from './accesstoken.service';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: 'RefreshToken', schema: RefreshTokenSchema }])],
  providers: [AccessTokenService, RefreshTokenService, RefreshTokensRepository],
  exports: [RefreshTokensRepository],
})
export class TokenModule {}
