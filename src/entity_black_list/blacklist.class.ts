import { ObjectId } from 'mongodb';

export class BlackList {
  public _id: any;
  public refreshTokens: any[];
  public __v: number;

  constructor() {
    this._id = new ObjectId();
    this.refreshTokens = [];
    this.__v = 0;
  }
}
