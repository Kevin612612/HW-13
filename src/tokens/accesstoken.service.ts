import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { jwtConstants } from '../auth/constants';
import { UserDataType } from '../types/users';
import { AccessTokensPayloadType } from '../types/accesstoken';

//(1) create accesstoken

@Injectable()
export class AccessTokenService {
  constructor(@Inject(JwtService) private jwtService: JwtService, @Inject(UserRepository) protected userRepository: UserRepository) {}

  //(1) generate accesstoken
  async generateAccessJWT(user: UserDataType) {
    const liveTimeInSeconds: number = parseInt(jwtConstants.ACCESS_TOKEN_LIFE_TIME);
    const payload = {
      loginOrEmail: user.accountData.login,
      sub: user.id,
      expiresIn: jwtConstants.ACCESS_TOKEN_LIFE_TIME,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.ACCESS_TOKEN_LIFE_TIME,
    });
    //put it into db
    const addAccessToken = await this.userRepository.addAccessToken(user.id, accessToken, liveTimeInSeconds);

    return { accessToken: accessToken };
  }

  //(2) retrieve payload from accessToken
  async getPayloadFromAccessToken(accessToken: string): Promise<AccessTokensPayloadType> {
    return await this.jwtService.verifyAsync(accessToken);
  }

  //(3) check type of payload
  async isPayloadValid(payload: any): Promise<boolean> {
    return (
      payload.hasOwnProperty('loginOrEmail') &&
      payload.hasOwnProperty('sub') &&
      payload.hasOwnProperty('expiresIn') &&
      payload.hasOwnProperty('iat') &&
      payload.hasOwnProperty('exp')
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
}
