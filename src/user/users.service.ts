import { Inject, Injectable } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { ObjectId } from 'mongodb';
import { UserViewType } from 'src/types/users';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  async findAll(): Promise<any> {
    return await this.userRepository.findAll();
  }

  async createUser(dto: UserDTO): Promise<UserViewType> {
    const userId = await this.userRepository.createUserId()
    const userObject = {
      _id: new ObjectId(),
      id: userId,
      login: dto.login,
      password: dto.password,
      email: dto.email,
      createdAt: new Date(),
    };
    const createdUser = await this.userRepository.createUser(userObject);
    const { _id, password, __v, ...userWithoutPassword } = createdUser.toObject();
    return userWithoutPassword;
  }

  async deleteUser(userId: string): Promise<any> {
    const result = await this.userRepository.deleteUserById(userId); // 0 || 1
    return result
      ? { status: 204, error: 'User was deleted' }
      : { status: 404, error: 'User not found' };
  }
}
