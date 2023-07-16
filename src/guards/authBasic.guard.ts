import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuardBasic implements CanActivate {
  constructor(@Inject(JwtService) protected jwtService: JwtService) {}

  //Basic Authorization
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    if (request.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
      throw new UnauthorizedException();
    }
    return true;
  }
}
