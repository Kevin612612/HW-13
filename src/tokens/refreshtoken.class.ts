import { ObjectId } from 'mongodb';
import { jwtConstants } from '../auth/constants';

export class RefreshToken {
  public _id: ObjectId;
  public createdAt: string;
  public expiredAt: string;
  public __v: number;

  constructor(
    public value: string,
    public userId: string,
    public deviceId: string,
    public deviceName: string,
    public IP: string,
  ) {
    this._id = new ObjectId();
    this.value = value;
    this.userId = userId;
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    this.IP = IP;
    this.createdAt = new Date().toISOString();
    this.expiredAt = new Date(
      new Date().getTime() + parseInt(jwtConstants.ACCESS_TOKEN_LIFE_TIME) * 1000,
    ).toISOString();
    this.__v = 0;
  }
}
