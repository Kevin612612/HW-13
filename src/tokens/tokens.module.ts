import { Module } from '@nestjs/common';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema } from './refreshtoken.schema';
import { RefreshTokenService } from './refreshtoken.service';
import { AccessTokenService } from './accesstoken.service';
import { BlackListModule } from '../black list/blacklist.module';

@Module({
  imports: [UserModule,
     MongooseModule.forFeature([{ name: 'RefreshToken', schema: RefreshTokenSchema }]),
     BlackListModule],
  providers: [AccessTokenService, RefreshTokenService, RefreshTokensRepository],
  exports: [AccessTokenService, RefreshTokenService, RefreshTokensRepository],
})
export class TokenModule {}
