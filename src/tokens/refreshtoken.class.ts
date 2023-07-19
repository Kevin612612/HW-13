import { ObjectId } from 'mongodb';
import { jwtConstants } from '../auth/constants';

//AccessTokensPayload
export class AccessTokensPayloadType {
  loginOrEmail: string;
  sub: string;
  expiresIn: string;

  constructor(loginOrEmail: string, sub: string, expiresIn: string) {
    this.loginOrEmail = loginOrEmail;
    this.sub = sub;
    this.expiresIn = expiresIn;
  }
}

//RefreshTokensPayload
export class RefreshTokensPayloadType {
  userId: string;
  login: string;
  email: string;
  deviceId: string;
  expiresIn: string;
  iat: number;

  constructor(userId: string, login: string, email: string, deviceId: string, expiresIn: string, iat: number) {
    this.userId = userId;
    this.login = login;
    this.email = email;
    this.deviceId = deviceId;
    this.expiresIn = expiresIn;
    this.iat = iat;
  }
}

export class RefreshToken {
  public _id: ObjectId;
  public createdAt: string;
  public expiredAt: string;
  public __v: number;

  constructor(public value: string, public userId: string, public deviceId: string, public deviceName: string, public IP: string) {
    this._id = new ObjectId();
    this.value = value;
    this.userId = userId;
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    this.IP = IP;
    this.createdAt = new Date().toISOString();
    this.expiredAt = new Date(new Date().getTime() + parseInt(jwtConstants.REFRESH_TOKEN_LIFE_TIME) * 1000).toISOString();
    this.__v = 0;
  }
}
