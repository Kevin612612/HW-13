import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { UserRepository } from '../user/user.repository';
import { BlackListRepository } from '../black list/blacklist.repository';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { TokenDto } from '../dto/token.dto';
import { validate } from 'class-validator';

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
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        //check if token expired
        const payload = await this.accessTokenService.getPayloadFromAccessToken(token);
        const tokenExpired = await this.refreshTokenService.isTokenExpired(payload);
        if (tokenExpired) {
          throw new UnauthorizedException();
        }
        //put user into request
        const user = await this.userRepository.findUserById(payload.sub);
        request.user = user; // Attach the user to the request object
        return true;
      } catch (error) {
        console.log('error:', error);
        throw new UnauthorizedException();
      }
    }

    // No Bearer access token, so check for the refresh token
    const refreshToken: string = request.cookies.refreshToken;
    if (!refreshToken) {
      // throw new BadRequestException(['Refresh token not found']);
      throw new UnauthorizedException();
    }
    const isInBlackList = await this.blackListRepository.findToken(refreshToken);
    if (isInBlackList) {
      // throw new BadRequestException(['Refresh token is already invalid']);
      throw new UnauthorizedException();
    }
    if (refreshToken) {
      try {
        const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken);

        const isValid = await this.refreshTokenService.isPayloadValid(payload);
        if (!isValid) {
          // throw new BadRequestException(['Invalid payload']);
          throw new UnauthorizedException();
        }
        const expired = await this.refreshTokenService.isTokenExpired(payload);
        if (expired) {
          // throw new BadRequestException(['Token has expired']);
          throw new UnauthorizedException();
        }
        //put user into request
        const user = await this.userRepository.findUserById(payload.userId);

        request.user = user; // Attach the user to the request object
        return true;
      } catch (error) {
        // Token verification failed
        return false;
      }
    }

    // No tokens or invalid format
    return false;
  }
}
