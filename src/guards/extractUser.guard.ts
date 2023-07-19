import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class UserExtractGuard implements CanActivate {
  constructor(
    @Inject(AccessTokenService) protected accessTokenService: AccessTokenService,
    @Inject(UserRepository) private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || null;
    const accessToken = authHeader ? authHeader.split(' ')[1] : null; //access token
    console.log('check accessToken', accessToken);

    if (accessToken && authHeader && authHeader.startsWith('Bearer ')) {
      try {
        //check access token
        const payload = await this.accessTokenService.getPayloadFromAccessToken(accessToken);
        const isValid = await this.accessTokenService.isPayloadValid(payload);
        if (!isValid) throw new UnauthorizedException();
        const tokenExpired = await this.accessTokenService.isTokenExpired(payload);
        if (tokenExpired) throw new UnauthorizedException();
        //put user into request
        const user = await this.userRepository.findUserById(payload.sub);
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
