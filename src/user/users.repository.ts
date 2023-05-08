import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUserId() {
    let userId = 1;
    while (userId) {
      let user = await this.userModel.findOne({ id: userId.toString() });
      if (!user) {
        break;
      }
      userId++;
    }
    return userId.toString();
  }

  async findAll(sortBy: string, sortDirection: string, searchNameTerm: string): Promise<User[]> {
    const order = sortDirection == 'asc' ? 1 : -1;
    const filter = searchNameTerm ? { login: { $regex: searchNameTerm, $options: 'i' } } : {};
    return await this.userModel
      .find(filter)
      .sort({ [sortBy]: order })
      .select({ _id: 0, __v: 0, password: 0 })
      .exec();
  }

  async countAllUsers(searchNameTerm: string) {
    const filter = searchNameTerm ? { login: { $regex: searchNameTerm, $options: 'i' } } : {};
    return await this.userModel.countDocuments(filter);
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
