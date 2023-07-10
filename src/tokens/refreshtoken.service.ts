import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { UserRepository } from '../user/user.repository';
import { RefreshTokensDataModel } from '../types/refreshtoken';
import { jwtConstants } from '../auth/constants';
import { BlackListRepository } from '../black list/blacklist.repository';
import { RefreshToken, RefreshTokensPayloadType } from './refreshtoken.class';

//(1) generateRefreshJWT
//(2) getPayloadFromRefreshToken
//(3) isPayloadValid
//(4) isTokenExpired
//(5) makeRefreshTokenExpired

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(RefreshTokensRepository) private refreshTokensRepository: RefreshTokensRepository,
    @Inject(BlackListRepository) private blackListRepository: BlackListRepository,
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  //(1) generate refreshtoken
  async generateRefreshJWT(user: any, deviceId: string, deviceName: string, IP: string) {
    const payload = {
      userId: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      deviceId: deviceId,
      expiresIn: jwtConstants.REFRESH_TOKEN_LIFE_TIME,
    };
    const liveTime = parseInt(jwtConstants.REFRESH_TOKEN_LIFE_TIME);

    const refreshTokenValue = await this.jwtService.signAsync(payload);
    const refreshTokenObject: RefreshTokensDataModel = new RefreshToken(refreshTokenValue, user.id, deviceId, deviceName, IP);
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

  //(1) this method transform all found data and returns them to router
  //   async allDevices(refreshToken: string): Promise<any> {
  //     //find refreshToken by value and return userId
  //     const payload = this.jwtService.verifyAsync(refreshToken);
  //     //find all refreshTokens by that userId and non expired date
  //     if (payload) {
  //       const result = await this.refreshTokensRepository.allActiveDevices(payload.userId);
  //       return result.map(result => {
  //         return {
  //           ip: result.IP,
  //           title: result.deviceName,
  //           deviceId: result.deviceId,
  //           lastActiveDate: result.createdAt,
  //         };
  //       });
  //     }
  //     return [];
  //   }

  //(2) this method terminates all other devices
  //   async terminateAllOtherDevices(refreshToken: string): Promise<boolean> {
  //     const payload = this.jwtService.verifyAsync(refreshToken);
  //     if (payload) {
  //       return await this.refreshTokensRepository.deleteOthers(payload.userId, payload.deviceId);
  //     }
  //     return false;
  //   }

  //(3) this method terminates current devices
  async terminateCurrentDevice(userId: string, deviceId: string): Promise<boolean | number> {
    const result = await this.refreshTokensRepository.deleteOne(userId, deviceId);
    return result ? result : 404;
  }
}
