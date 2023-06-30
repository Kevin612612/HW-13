import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { UserRepository } from '../user/users.repository';
import { RefreshTokensDataModel } from '../types/refreshtoken';
import { jwtConstants } from '../auth/constants';
import { RefreshToken } from './refreshtoken.class';
import { UserDataType } from '../types/users';

//(1) create refreshtoken

@Injectable()
export class AccessTokenService {
  constructor(@Inject(JwtService) private jwtService: JwtService, @Inject(UserRepository) protected userRepository: UserRepository) {}

  //(1) generate accesstoken
  async generateAccessJWT(user: UserDataType) {
    const liveTimeInSeconds: number = parseInt(jwtConstants.ACCESS_TOKEN_LIFE_TIME);
    const payload = {
      loginOrEmail: user.accountData.login,
      sub: user.id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    //put it into db
    const addAccessToken = await this.userRepository.addAccessToken(user.id, accessToken, liveTimeInSeconds);

    return { access_token: accessToken };
  }
}
