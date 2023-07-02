import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { BlackListRepository } from '../black list/blacklist.repository';

@Injectable()
export class CheckRefreshTokenMiddleware implements NestMiddleware {
  constructor(
    @Inject(RefreshTokenService) protected refreshTokenService: RefreshTokenService,
    @Inject(BlackListRepository) protected blackListRepository: BlackListRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const isInBlackList = await this.blackListRepository.findToken(refreshToken);
    if (isInBlackList) {
      throw new Error('Refresh token is already invalid');
    }

    try {
      const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken);      

      const isValid = await this.refreshTokenService.isPayloadValid(payload);      
      if (!isValid) {
        throw new Error('Invalid payload');
      }
      const expired = await this.refreshTokenService.isTokenExpired(payload);
      if (expired) {
        throw new Error('Token has expired');
      }
      next();
    } catch (error) {
      console.log(error);
      
      throw new Error('Invalid refresh token.');
    }
  }
}
