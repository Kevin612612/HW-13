import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class UserExtractGuard implements CanActivate {
  constructor(
    @Inject(AccessTokenService) protected accessTokenService: AccessTokenService,
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}
  //
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        //check if token valid and not expired
        const payload = await this.accessTokenService.getPayloadFromAccessToken(token);
        const isValid = await this.accessTokenService.isPayloadValid(payload);
        if (!isValid) throw new UnauthorizedException();
        const tokenExpired = await this.accessTokenService.isTokenExpired(payload);
        if (tokenExpired) throw new UnauthorizedException();
        //put user into request
        const user = await this.userRepository.findUserById(payload.sub);
        request.user = user;
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
