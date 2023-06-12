import { Inject, Injectable } from '@nestjs/common';
import { UserDTO } from '../user/dto/userInputDTO';
import { UserTypeSchema, UserViewType } from '../types/users';
import { UserRepository } from './users.repository';
import { QueryUserDTO } from '../dto/query.dto';
import { User } from './user.class';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';

//(1) allUsers
//(2) newPostedUser
//(3) deleteUser
//(4) confirm code
//(5) update password
//(6) method registers user

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) protected userRepository: UserRepository,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<any> {
    return await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  //(1) this method returns all users
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
    const usersViewtype: UserViewType[] = users.map(obj => {
      return {
        id: obj.id,
        login: obj.accountData.login,
        email: obj.accountData.email,
        createdAt: obj.accountData.createdAt,
      };
    });
    const quantityOfDocs = await this.userRepository.countAllUsers(filter);

    return {
      pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
      page: +pageParams.pageNumber,
      pageSize: +pageParams.pageSize,
      totalCount: quantityOfDocs,
      items: usersViewtype.slice(
        (+pageParams.pageNumber - 1) * +pageParams.pageSize,
        +pageParams.pageNumber * +pageParams.pageSize,
      ),
    };
  }

  //(2) method creates user
  async createUser(dto: UserDTO): Promise<UserViewType | any> {
    //create new user
    let newUser = new User(this.userRepository, this.jwtService); //empty user
    newUser = await newUser.addAsyncParams(dto); // fill user with async params
    // put this new user into db
    try {
      const result = await this.userRepository.createUser(newUser);
      return {
        id: newUser.id,
        login: newUser.accountData.login,
        email: newUser.accountData.email,
        createdAt: newUser.accountData.createdAt,
      };
    } catch (err: any) {
      const validationErrors = [];
      if (err instanceof mongoose.Error.ValidationError) {
        for (const path in err.errors) {
          //accountData.login, accountData.email - path
          const error = err.errors[path].message;
          validationErrors.push(error);
        }
      }
      return validationErrors;
    }
  }

  //(3) method deletes user by ID
  async deleteUserById(userId: string): Promise<any> {
    return await this.userRepository.deleteUserById(userId);
  }

  //(4) confirm code
  async confirmCodeFromEmail(code: string): Promise<boolean | number> {
    const user = await this.userRepository.findUserByCode(code);
    //check if user exists and email is not confirmed and code is not expired
    if (user && user.emailConfirmation.isConfirmed != true && new Date(user.emailConfirmation.expirationDate) > new Date() ) {
      const changeStatus = await this.userRepository.updateStatus(user);
      return 204;
    }
    return 400;
  }

  //(5) update password
  async updatePassword(userId: string, newPassword: string): Promise<number> {
    const newPasswordSalt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const result = await this.userRepository.updateSaltAndHash(userId, newPasswordSalt, newPasswordHash);
    return 204;
  }

  //(6) method registers user
  async newRegisteredUser(login: string, email: string, password: string): Promise<UserViewType | number | any> {
    const newUser = await this.createUser({login, password, email})

    //send email from our account to this user's email
    try {
      const sendEmail = await this.emailService.sendEmailConfirmationMessage(
        newUser.id,
        newUser.accountData.email,
        newUser.emailConfirmation.confirmationCode,
      );
      return {
        id: `user with id ${newUser.id} and email ${email} has received a letter with code`,
        login: newUser.accountData.login,
        email: newUser.accountData.email,
        createdAt: newUser.accountData.createdAt,
      };
    } catch (error) {
      return 400; //email hasn't been sent
    }
  }
}
