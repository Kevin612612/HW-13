import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserDTO } from '../dto/user.dto';
import { UserTypeSchema, UserViewType } from '../types/users';
import { UserRepository } from './users.repository';
import { QueryUserDTO } from '../dto/query.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(UserRepository) protected userRepository: UserRepository) {}

  async findAll(query: QueryUserDTO): Promise<UserTypeSchema> {
    const pageParams = {
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      pageNumber: query.pageNumber || 1,
      searchLoginTerm: query.searchLoginTerm || '',
      searchEmailTerm: query.searchEmailTerm || '',
      pageSize: query.pageSize || 10,
    };
    const filter = pageParams.searchLoginTerm
      ? pageParams.searchEmailTerm
        ? {
            $or: [
              {
                login: {
                  $regex: pageParams.searchLoginTerm,
                  $options: 'i',
                },
              },
              {
                email: {
                  $regex: pageParams.searchEmailTerm,
                  $options: 'i',
                },
              },
            ],
          }
        : {
            login: {
              $regex: pageParams.searchLoginTerm,
              $options: 'i',
            },
          }
      : pageParams.searchEmailTerm
      ? {
          email: {
            $regex: pageParams.searchEmailTerm,
            $options: 'i',
          },
        }
      : {};
    const users = await this.userRepository.findAll(filter, pageParams.sortBy, pageParams.sortDirection);
    const quantityOfDocs = await this.userRepository.countAllUsers(filter);

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
    const userId = await this.userRepository.createUserId();
    const userObject = {
      _id: new ObjectId(),
      id: userId,
      login: dto.login,
      password: dto.password,
      email: dto.email,
      createdAt: new Date().toISOString(),
    };
    const createdUser = await this.userRepository.createUser(userObject);
    const { _id, password, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  async deleteUserById(userId: string): Promise<any> {
    return await this.userRepository.deleteUserById(userId);
  }
}
