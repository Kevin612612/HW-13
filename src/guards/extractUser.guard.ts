import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenService } from '../entity_tokens/accesstoken.service';
import { UserRepository } from '../entity_user/user.repository';

@Injectable()
export class UserExtractGuard implements CanActivate {
	constructor(
		@Inject(AccessTokenService) protected accessTokenService: AccessTokenService,
		@Inject(UserRepository) private userRepository: UserRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<any> {
		console.log('UserExtractGuard starts performing'); //that string is for vercel log reading
		const request: Request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization || null;
		const accessToken = authHeader?.split(' ')[1] || null;
		console.log('check accessToken', accessToken); //that string is for vercel log reading

		if (!accessToken || !authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException();
		}
		try {
			const payloadFromAccessToken = await this.validateAccessTokenAndExtractPayload(accessToken);
			request.user = await this.userRepository.findUserById(payloadFromAccessToken.sub);
			return true;
		} catch (error) {
			console.log('Error from UserExtractGuard:', error);
			throw new UnauthorizedException();
		}
	}

	private async validateAccessTokenAndExtractPayload(accessToken: string): Promise<any> {
		const payload = await this.accessTokenService.getPayloadFromAccessToken(accessToken);
		/** Validation*/
    const tokenExpired = await this.accessTokenService.isTokenExpired(payload);
    const tokenIsValid = await this.accessTokenService.isPayloadValid(payload);
		if (tokenExpired || !tokenIsValid) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
