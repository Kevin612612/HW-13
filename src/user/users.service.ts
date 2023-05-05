import { Inject, Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from 'src/dto/user.dto';
import { ObjectId } from 'mongodb';
import { UserViewType } from 'src/types/users';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {

    constructor(@Inject(UserRepository) protected userRepository: UserRepository) {}

    async findAll(): Promise<any> {
        return this.userRepository.findAll();
    }

    async createUser(dto: UserDTO): Promise<UserViewType> {
        const userObject = {_id: new ObjectId(),
                                id: '1010',
                                login: dto.login,
                                password: dto.password,
                                email: dto.email,
                                createdAt: new Date()}
        const createdUser = await this.userRepository.createUser(userObject);
        const { _id, password, __v, ...userWithoutPassword } = createdUser.toObject();
        return userWithoutPassword;
    }

    async deleteUser(userId: string): Promise<any> {
        const result = await this.userRepository.deleteUserById(userId); // 0 || 1
        return result ? {status: 204, error: 'User was deleted'} : {status: 404, error: 'User not found'}
    }


}
