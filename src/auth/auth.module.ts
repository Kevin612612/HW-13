import { BlackListModule } from '../entity_black_list/blacklist.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../entity_user/user.module';
import { AuthController } from './auth.controller';
import { UserSchema } from '../entity_user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { RefreshTokenSchema } from '../entity_tokens/refreshtoken.schema';
import { TokenModule } from '../entity_tokens/tokens.module';
import { UserExistsByLoginOrEmail, UserExistsByLogin, UserExistsByEmail, EmailAlreadyConfirmed } from '../validation/userValidation';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    BlackListModule,
    EmailModule,
    TokenModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
  ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserExistsByLoginOrEmail, UserExistsByLogin, UserExistsByEmail, EmailAlreadyConfirmed],
  exports: [AuthService],
})
export class AuthModule {}
