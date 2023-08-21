import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RefreshTokenService } from '../entity_tokens/refreshtoken.service';
import { UserRepository } from '../entity_user/user.repository';
import { BlackListRepository } from '../entity_black_list/blacklist.repository';
import { AccessTokenService } from '../entity_tokens/accesstoken.service';
import { LogFunctionName } from '../decorators/logger.decorator';

@Injectable()
export class AuthGuardBearer implements CanActivate {
	constructor(
		@Inject(JwtService) protected jwtService: JwtService,
		@Inject(RefreshTokenService) protected refreshTokenService: RefreshTokenService,
		@Inject(AccessTokenService) protected accessTokenService: AccessTokenService,
		@Inject(UserRepository) private userRepository: UserRepository,
		@Inject(BlackListRepository) protected blackListRepository: BlackListRepository,
	) {}

	@LogFunctionName()
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization || null;
		const accessToken = authHeader?.split(' ')[1] || null;
		//console.log('check accessToken', accessToken); //that string is for vercel log reading

		if (!accessToken || !authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException();
		}
		try {
			const payloadFromAccessToken = await this.validateAccessTokenAndExtractPayload(accessToken);
			request.user = await this.userRepository.findUserById(payloadFromAccessToken.sub);
			return true;
		} catch (error) {
			console.log('Error from AuthGuardBearer:', error);
			throw new UnauthorizedException();
		}
	}

	private async validateAccessTokenAndExtractPayload(accessToken: string): Promise<any> {
		const payload = await this.accessTokenService.getPayloadFromAccessToken(accessToken);
		/** Validation*/
		const tokenIsValid = await this.accessTokenService.isPayloadValid(payload);
		const tokenExpired = await this.accessTokenService.isTokenExpired(payload);

		if (tokenExpired || !tokenIsValid) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
