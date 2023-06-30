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
import { UserExistsByLogin, UserExistsByEmail } from '../validation/validation';

@Module({
  imports: [
    UserModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, UserRepository, EmailService, UserExistsByLogin, UserExistsByEmail],
  exports: [AuthService],
})
export class AuthModule {}
