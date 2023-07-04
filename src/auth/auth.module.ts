import { BlackListModule } from './../black list/blacklist.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { UserSchema } from '../user/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { UserExistsByLoginOrEmail, UserExistsByLogin, UserExistsByEmail } from '../validation/validation';
import { RefreshTokenSchema } from '../tokens/refreshtoken.schema';
import { TokenModule } from '../tokens/tokens.module';

@Module({
  imports: [
    UserModule,
    BlackListModule,
    EmailModule,
    TokenModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: jwtConstants.ACCESS_TOKEN_LIFE_TIME },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'RefreshToken', schema: RefreshTokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserExistsByLoginOrEmail, UserExistsByLogin, UserExistsByEmail],
  exports: [AuthService],
})
export class AuthModule {}
