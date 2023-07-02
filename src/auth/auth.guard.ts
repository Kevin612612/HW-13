import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { UserRepository } from '../user/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AccessTokenService) private accessTokenService: AccessTokenService,
  @Inject(UserRepository) private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.accessTokenService.getPayloadFromAccessToken(accessToken);
      const user = await this.userRepository.findUserById(payload.sub);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
