import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

//(1) login
//(2) sendRecoveryCode
//(3) getUserByAccessToken

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  //(1)
  async login(dto) {
    const user = await this.usersService.findUserByLoginOrEmail(dto.loginOrEmail);
    const passwordHash = await bcrypt.hash(dto.password, user.accountData.passwordSalt);
    if (passwordHash !== user.accountData.passwordHash) {
      throw new UnauthorizedException();
    } else {
      const payload = { loginOrEmail: user.accountData.login, sub: user.id, expiresAt: Math.floor(Date.now() / 1000) + (60 * 60) };
      return { access_token: await this.jwtService.signAsync(payload) };
    }
  }

  //(2)
  async sendRecoveryCode(email) {
    return await this.emailService.sendRecoveryCode(email);
  }

  //(3) method return user by access-token
  async getUserByAccessToken(token: string) {
    const user = this.jwtService.verify(token);
    return user;
  }
}
