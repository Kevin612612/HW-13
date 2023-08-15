import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../entity_user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { AccessTokenService } from '../entity_tokens/accesstoken.service';
import { RefreshTokenService } from '../entity_tokens/refreshtoken.service';
import { LoginDTO } from './dto/login.dto';

//(1) login
//(2) sendRecoveryCode
//(3) getUserByAccessToken

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(AccessTokenService) private accessTokenService: AccessTokenService,
    @Inject(RefreshTokenService) private refreshTokenService: RefreshTokenService,
  ) {}

  //(1)
  async login(dto: LoginDTO, deviceId: string, deviceName: string, IP: string) {
    const user = await this.usersService.findUserByLoginOrEmail(dto.loginOrEmail);
    
    const passwordHash = await bcrypt.hash(dto.password, user.accountData.passwordSalt);
    if (passwordHash !== user.accountData.passwordHash) {
      throw new UnauthorizedException();
    } else {
      const accessTokenObject = await this.accessTokenService.generateAccessJWT(user);
      const refreshTokenObject = await this.refreshTokenService.generateRefreshJWT(user, deviceId, deviceName, IP);
      return { accessToken: accessTokenObject, refreshToken: refreshTokenObject };
    }
  }

  //(2)
  async sendRecoveryCode(email: string) {
    return await this.emailService.sendRecoveryCode(email);
  }

  //(3) method return user by access-token
  async getUserByAccessToken(token: string) {
    const user = this.jwtService.verify(token);
    return user;
  }
}
