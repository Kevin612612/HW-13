import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { UserRepository } from '../user/users.repository';
import { BlackListRepository } from '../black list/blacklist.repository';

@Injectable()
export class AuthGuardBearer implements CanActivate {
  constructor(
    @Inject(JwtService) protected jwtService: JwtService,
    @Inject(RefreshTokenService) protected refreshTokenService: RefreshTokenService,
    @Inject(UserRepository) private userRepository: UserRepository,
    @Inject(BlackListRepository) protected blackListRepository: BlackListRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log(authHeader);

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      console.log(token);

      try {
        //check if token expired
        const payload = await this.refreshTokenService.getPayloadFromRefreshToken(token);
        console.log(payload);

        const tokenExpired = await this.refreshTokenService.isTokenExpired(payload);
        console.log(tokenExpired);

        if (tokenExpired) {
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

    // No Bearer token, check for the refresh token
    const refreshToken: string = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestException(['Refresh token not found']);
    }
    const isInBlackList = await this.blackListRepository.findToken(refreshToken);
    if (isInBlackList) {
      throw new BadRequestException(['Refresh token is already invalid']);
    }
    if (refreshToken) {
      try {
        const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken);

        const isValid = await this.refreshTokenService.isPayloadValid(payload);
        if (!isValid) {
          throw new BadRequestException(['Invalid payload']);
        }
        const expired = await this.refreshTokenService.isTokenExpired(payload);
        if (expired) {
          throw new BadRequestException(['Token has expired']);
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
