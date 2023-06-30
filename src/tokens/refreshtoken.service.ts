import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { UserRepository } from '../user/users.repository';
import { RefreshTokensDataModel } from '../types/refreshtoken';
import { jwtConstants } from '../auth/constants';
import { RefreshToken } from './refreshtoken.class';

//(1) create refreshtoken

//(1) allDevices
//(2) terminateAllOtherDevices
//(3) terminateCurrentDevice

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(RefreshTokensRepository) private refreshTokensRepository: RefreshTokensRepository,
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  //(1) generate refreshtoken
  async generateRefreshJWT(user: any, deviceId: string, deviceName: string, IP: string) {
    const payload = {
      userId: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      deviceId: deviceId,
    };
    const liveTime = parseInt(jwtConstants.REFRESH_TOKEN_LIFE_TIME);

    const refreshTokenValue = await this.jwtService.signAsync(payload);
    const refreshTokenObject: RefreshTokensDataModel = new RefreshToken(refreshTokenValue, user.id, deviceId, deviceName, IP);
    //put it into db 
    const result1 = await this.userRepository.addRefreshToken(user.id, refreshTokenValue, liveTime);
    const result2 = await this.refreshTokensRepository.newCreatedToken(refreshTokenObject);

    return refreshTokenObject;
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
