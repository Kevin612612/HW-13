import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUserId() {
    let userId = 1;
    while (userId) {
      let user = await this.userModel.findOne({ id: userId.toString() });
      if (!user) {break}
      userId++;
    }
    return userId.toString();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async createUser(userObject: any): Promise<any> {
    const createdUser = new this.userModel(userObject);
    return await createdUser.save();
  }

  async deleteUserById(userId: string): Promise<number> {
    const result = await this.userModel.deleteOne({ id: userId });
    return result.deletedCount;
  }

  async deleteAll(): Promise<number> {
    const result = await this.userModel.deleteMany({});
    return result.deletedCount;
  }
}
