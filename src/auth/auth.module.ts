import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { UsersService } from '../user/users.service';
import { UserRepository } from '../user/users.repository';
import { UserSchema } from '../user/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { UserExistsByLoginOrEmail, UserExistsByLogin, UserExistsByEmail } from '../validation/validation';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { RefreshTokensRepository } from '../tokens/refreshtoken.repository';
import { RefreshTokenSchema } from '../tokens/refreshtoken.schema';

@Module({
  imports: [
    UserModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.ACCESS_TOKEN_LIFE_TIME },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'RefreshToken', schema: RefreshTokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AccessTokenService, RefreshTokenService, UserRepository, RefreshTokensRepository, EmailService, UserExistsByLoginOrEmail, UserExistsByLogin, UserExistsByEmail],
  exports: [AuthService],
})
export class AuthModule {}
