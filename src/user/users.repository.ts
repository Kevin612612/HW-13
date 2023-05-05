////Data access Layer

//(1)  allUsers
//(2)  newPostedUser
//(3)  deleteUser
//(4)  findUserByLoginOrEmail
//(5)  findUserByLogin
//(6)  findUserByPasswordCode
//(7)  returns user by code
//(8)  update status
//(9)  update code
//(10) update date when the code was sent
//(11) update salt and hash
//(12) add accessToken into db
//(13) add refreshToken into db
//(14) add code
//(15) set refreshToken expired

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

// import { UserDataType } from './../types/users.d';
// import { UserModel } from './users.schema';

@Injectable()
export class UserRepository {

    constructor(@InjectModel(User.name) private userModel : Model<UserDocument>) {}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async createUser(userObject: any): Promise<any> {
        const createdUser = new this.userModel(userObject)
        return createdUser.save();
    }

    async deleteUserById(userId: string): Promise<number> {
        const result = await this.userModel.deleteOne({id: userId}); //{ acknowledged: true, deletedCount: 1 }
        return result.deletedCount
      }

    
}
