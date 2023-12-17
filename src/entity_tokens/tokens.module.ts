import { Module } from '@nestjs/common';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './refreshtoken.schema';
import { RefreshTokenService } from './refreshtoken.service';
import { AccessTokenService } from './accesstoken.service';
import { BlackListModule } from '../entity_black_list/blacklist.module';
import { UserRepository } from '../entity_user/user.repository';
import { User, UserSchema } from '../entity_user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BlackListModule,
  ],
  providers: [AccessTokenService, RefreshTokenService, RefreshTokensRepository, UserRepository],
  exports: [AccessTokenService, RefreshTokenService, RefreshTokensRepository],
})
export class TokenModule {}
