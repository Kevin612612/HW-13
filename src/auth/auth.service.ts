import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

//(1)
//(2)
//(3)

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  //(1) 
  async signIn(loginOrEmail: string, pass: string) {
    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);
    if (user?.password !== pass) throw new UnauthorizedException();
    const payload = { loginOrEmail: user.login, sub: user.id, exp: user.createdAt };
    return { access_token: await this.jwtService.signAsync(payload) };
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
