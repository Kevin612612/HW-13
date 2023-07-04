import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/users.repository';
import { jwtConstants } from './constants';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { RefreshTokenService } from '../tokens/refreshtoken.service';

//(1) login
//(2) sendRecoveryCode
//(3) getUserByAccessToken

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(UserRepository) private userRepository: UserRepository,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(AccessTokenService) private accessTokenService: AccessTokenService,
    @Inject(RefreshTokenService) private refreshTokenService: RefreshTokenService,
  ) {}

  //(1)
  async login(dto, deviceId, deviceName, IP) {
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
  async sendRecoveryCode(email) {
    return await this.emailService.sendRecoveryCode(email);
  }

  //(3) method return user by access-token
  async getUserByAccessToken(token: string) {
    const user = this.jwtService.verify(token);
    return user;
  }
}
