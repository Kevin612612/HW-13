import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlackListDocument } from './blacklist.schema';
import { BlackList } from './blacklist.class';
import { BlackListType } from '../types/blacklist';

//(0)   deleteAllData
//(1)   createObject
//(2)   addToken

@Injectable()
export class BlackListRepository {
  constructor(@InjectModel('BlackList') private blacklistModel: Model<BlackListDocument>) {}

  //(0) delete all data
  async deleteAllData(): Promise<boolean> {
    const result = await this.blacklistModel.deleteMany({});
    return result.acknowledged;
  }

  //(0) delete tokens
  async deleteTokens(): Promise<boolean> {
    const result = await this.blacklistModel.updateOne(
      {},
      {
        $set: {
          refreshTokens: [],
        },
      },
    );
    return result.acknowledged;
  }

  //(1) method creates object
  async createBlackList(): Promise<any> {
    const blackListObject: BlackListType = new BlackList();
    const createdBlackList = new this.blacklistModel(blackListObject);
    return await createdBlackList.save();
  }

  //(2) add token
  async addToken(token: string): Promise<any> {
    const result = await this.blacklistModel.findOneAndUpdate(
      { __v: 0 },
      {
        $push: {
          refreshTokens: token,
        },
      },
    );
    return true;
  }

  //(3) find token
  async findToken(token): Promise<boolean> {
    const result = await this.blacklistModel
      .findOne({
        refreshTokens: { $elemMatch: { $regex: token } },
      })
      .exec();    
    return result ? true : false;
  }
}
