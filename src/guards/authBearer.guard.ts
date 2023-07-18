import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { UserRepository } from '../user/user.repository';
import { BlackListRepository } from '../black list/blacklist.repository';
import { AccessTokenService } from '../tokens/accesstoken.service';

@Injectable()
export class AuthGuardBearer implements CanActivate {
  constructor(
    @Inject(JwtService) protected jwtService: JwtService,
    @Inject(RefreshTokenService) protected refreshTokenService: RefreshTokenService,
    @Inject(AccessTokenService) protected accessTokenService: AccessTokenService,
    @Inject(UserRepository) private userRepository: UserRepository,
    @Inject(BlackListRepository) protected blackListRepository: BlackListRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || null;
    const accessToken = authHeader ? authHeader.split(' ')[1] : null; //access token
    const refreshToken = request.cookies.refreshToken || null; // refresh token
    console.log('check accessToken', accessToken);
    console.log('check refreshToken', refreshToken);

    if (accessToken && refreshToken && authHeader && authHeader.startsWith('Bearer ')) {
      try {
        //check access token 
        const payload1 = await this.accessTokenService.getPayloadFromAccessToken(accessToken);
        const tokenExpired = await this.accessTokenService.isTokenExpired(payload1);
        if (tokenExpired) throw new UnauthorizedException();
        // check refresh token
        const payload2 = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken);
        const isInBlackList = await this.blackListRepository.findToken(refreshToken);
        if (isInBlackList) throw new UnauthorizedException();
        const isValid = await this.refreshTokenService.isPayloadValid(payload2);
        if (!isValid) throw new UnauthorizedException();
        const expired = await this.refreshTokenService.isTokenExpired(payload2);
        if (expired) throw new UnauthorizedException();
        //put user into request
        const user = await this.userRepository.findUserById(payload1.sub);
        request.user = user; // Attach the user to the request object
        return true;
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException();
      } 
    } else {
      throw new UnauthorizedException();
    }
  }
}
