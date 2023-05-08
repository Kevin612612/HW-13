import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserDTO } from '../dto/user.dto';
import { UserTypeSchema, UserViewType } from '../types/users';
import { UserRepository } from './users.repository';
import { QueryDTO } from '../dto/query.dto';


@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  async findAll(query: QueryDTO): Promise<UserTypeSchema> {
    const pageParams = {
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      pageNumber: query.pageNumber || 1,
      searchNameTerm: query.searchNameTerm || '',
      pageSize: query.pageSize || 10,
    };
    const users = await this.userRepository.findAll(
      pageParams.sortBy,
      pageParams.sortDirection,
      pageParams.searchNameTerm
    );
    const quantityOfDocs = await this.userRepository.countAllUsers(pageParams.searchNameTerm);

    return {
      pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
      page: +pageParams.pageNumber,
      pageSize: +pageParams.pageSize,
      totalCount: quantityOfDocs,
      items: users.slice(
        (+pageParams.pageNumber - 1) * +pageParams.pageSize,
        +pageParams.pageNumber * +pageParams.pageSize,
      ),
    };
  }

  async createUser(dto: UserDTO): Promise<UserViewType> {
    const userId = await this.userRepository.createUserId()
    const userObject = {
      _id: new ObjectId(),
      id: userId,
      login: dto.login,
      password: dto.password,
      email: dto.email,
      createdAt: (new Date()).toISOString(),
    };
    const createdUser = await this.userRepository.createUser(userObject);
    const { _id, password, ...userWithoutPassword } = userObject
    return userWithoutPassword;
  }

  async deleteUser(userId: string): Promise<any> {
    const result = await this.userRepository.deleteUserById(userId); // 0 || 1
    return result
      ? { status: 204, error: 'User was deleted' }
      : { status: 404, error: 'User not found' };
  }
}
