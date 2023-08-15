import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Request } from 'express';

@Injectable()
export class AuthGuardBasic implements CanActivate {
	constructor(@Inject(JwtService) protected jwtService: JwtService) {}

	/**
	 * A guard that checks if the incoming request has the correct Basic Authorization credentials.
	 * If the credentials are valid, the request is allowed to proceed. Otherwise, an UnauthorizedException is thrown.
	 *
	 * @param context The execution context of the incoming request.
	 * @returns True if the request has valid credentials, otherwise throws an UnauthorizedException.
	 */
	canActivate(context: ExecutionContext) {
    console.log('AuthGuardBasic starts performing'); //that string is for vercel log reading
		const request: Request = context.switchToHttp().getRequest();
		if (request.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
			throw new UnauthorizedException();
		}
		return true;
	}
}
