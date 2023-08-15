import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { UserRepository } from '../entity_user/user.repository';
import { BlackListRepository } from '../entity_black_list/blacklist.repository';
import { RefreshToken, RefreshTokensPayloadType } from './refreshtoken.class';

//(1) generateRefreshJWT
//(2) getPayloadFromRefreshToken
//(3) isPayloadValid
//(4) isTokenExpired
//(5) makeRefreshTokenExpired
//(6) allDevices
//(7) terminateAllOtherDevices
//(8) terminateCurrentDevice

@Injectable()
export class RefreshTokenService {
	private refreshTokenLifeTime: number;
	constructor(
		@Inject(JwtService) private jwtService: JwtService,
		@Inject(RefreshTokensRepository) private refreshTokensRepository: RefreshTokensRepository,
		@Inject(BlackListRepository) private blackListRepository: BlackListRepository,
		@Inject(UserRepository) protected userRepository: UserRepository,
		@Inject(ConfigService) protected configService: ConfigService,
	) {
		this.refreshTokenLifeTime = parseInt(this.configService.get('REFRESH_TOKEN_LIFE_TIME'));
	}

	//(1) generate refreshToken
	async generateRefreshJWT(user: any, deviceId: string, deviceName: string, IP: string) {
		const payload = {
			userId: user.id,
			login: user.accountData.login,
			email: user.accountData.email,
			deviceId: deviceId,
			expiresIn: this.refreshTokenLifeTime,
		};
		const liveTime = this.refreshTokenLifeTime;

		const refreshTokenValue = await this.jwtService.signAsync(payload, {
			expiresIn: this.refreshTokenLifeTime,
		});
		const refreshTokenObject = new RefreshToken(refreshTokenValue, user.id, deviceId, deviceName, IP, this.configService);
		//put it into db
		const result1 = await this.userRepository.addRefreshToken(user.id, refreshTokenValue, liveTime);
		const result2 = await this.refreshTokensRepository.newCreatedToken(refreshTokenObject);

		return refreshTokenObject;
	}

	//(2) retrieve payload from refreshtoken
	async getPayloadFromRefreshToken(refreshToken: string): Promise<RefreshTokensPayloadType> {
		return await this.jwtService.verifyAsync(refreshToken);
	}

	//(3) check type of payload
	async isPayloadValid(payload: any): Promise<boolean> {
		return (
			payload.hasOwnProperty('userId') &&
			payload.hasOwnProperty('login') &&
			payload.hasOwnProperty('email') &&
			payload.hasOwnProperty('deviceId') &&
			payload.hasOwnProperty('expiresIn') &&
			payload.hasOwnProperty('iat')
		);
	}

	//(4) check token expiration
	async isTokenExpired(payload: any): Promise<boolean> {
		const currentTime = Math.floor(Date.now() / 1000); // Convert current time to seconds
		if (payload.iat && payload.expiresIn) {
			const expirationTime: number = payload.iat + parseInt(payload.expiresIn, 10);
			return currentTime >= expirationTime;
		}
		return true; // If the token payload doesn't have expiresIn, consider it as expired
	}

	//(5) make refreshToken Invalid
	async makeRefreshTokenExpired(token: string): Promise<boolean> {
		const result = await this.blackListRepository.addToken(token);
		return true;
	}

	//(6) this method transform all found data and returns them to router
	async allDevices(userId: string): Promise<any> {
		const result = await this.refreshTokensRepository.allActiveDevices(userId);
		return result.map((result) => {
			return {
				ip: result.IP,
				title: result.deviceName,
				deviceId: result.deviceId,
				lastActiveDate: result.createdAt,
			};
		});
	}

	//(7) this method terminates all other devices
	async terminateAllOtherDevices(userId: string, deviceId: string): Promise<boolean> {
		// todo: add deleted refreshtokens into blacklist
		return await this.refreshTokensRepository.deleteOthers(userId, deviceId);
	}

	//(8) this method terminates current devices
	async terminateCurrentDevice(userId: string, deviceId: string): Promise<boolean> {
		// todo: add deleted refreshtoken into blacklist
		const result = await this.refreshTokensRepository.deleteOne(userId, deviceId);
		if (result) {
			return true;
		} else {
			throw new ForbiddenException(["it's not your device"]);
		}
	}
}
