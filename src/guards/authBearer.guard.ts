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
		// const refreshToken = request.cookies.refreshToken || null;
		//console.log('check accessToken', accessToken); //that string is for vercel log reading
		//console.log('check refreshToken', refreshToken); //that string is for vercel log reading

		if (!accessToken || !authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException();
		}
		//try {
		const payloadFromAccessToken = await this.validateAccessTokenAndExtractPayload(accessToken);
		//const payloadFromRefreshToken = await this.validateRefreshTokenAndExtractPayload(refreshToken);
		const user = await this.userRepository.findUserById(payloadFromAccessToken.sub);
		if (user.banInfo.isBanned === true) {
			throw new NotFoundException([`user is banned`]);
		}
		request.user = user;
		return true;
		// } catch (error) {
		// 	console.log('Error from AuthGuardBearer:', error);
		// 	throw new UnauthorizedException();
		// }
	}

	private async validateAccessTokenAndExtractPayload(accessToken: string): Promise<any> {
		const payload = await this.accessTokenService.getPayloadFromAccessToken(accessToken);
		/** Validation*/
		if (await this.accessTokenService.isTokenExpired(payload)) {
			throw new UnauthorizedException();
		}
		return payload;
	}

	private async validateRefreshTokenAndExtractPayload(refreshToken: string): Promise<any> {
		const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken);
		/** Validation*/
		if (await this.blackListRepository.findToken(refreshToken)) {
			throw new UnauthorizedException();
		}
		if (!(await this.refreshTokenService.isPayloadValid(payload)) || (await this.refreshTokenService.isTokenExpired(payload))) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
