import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/users.repository';
import { jwtConstants } from '../auth/constants';
import { UserDataType } from '../types/users';
import { AccessTokensPayloadType } from './refreshtoken.class';

//(1) create accesstoken

@Injectable()
export class AccessTokenService {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  //(1) generate accesstoken
  async generateAccessJWT(user: UserDataType) {
    const liveTimeInSeconds: number = parseInt(jwtConstants.ACCESS_TOKEN_LIFE_TIME);
    const payload = {
      loginOrEmail: user.accountData.login,
      sub: user.id,
      expiresIn: jwtConstants.ACCESS_TOKEN_LIFE_TIME,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    //put it into db
    const addAccessToken = await this.userRepository.addAccessToken(user.id, accessToken, liveTimeInSeconds);

    return { access_token: accessToken };
  }

  //(2) retrieve payload from accessToken
  async getPayloadFromAccessToken(accessToken: string): Promise<AccessTokensPayloadType> {
    return await this.jwtService.verifyAsync(accessToken);
  }
}
