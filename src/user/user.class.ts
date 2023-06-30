import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { CodeDataType, UserAccountDataType, ConformationType, TokenType } from '../types/users';
import { UserRepository } from './users.repository';
import { Inject } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid'
import { UserDTO } from './dto/userInputDTO';
import { JwtService } from '@nestjs/jwt';


export class User {
  public _id: ObjectId;
  public accountData: UserAccountDataType;
  public emailConfirmation: ConformationType;
  public emailCodes: CodeDataType[];
  public passwordConfirmation: ConformationType;
  public passwordCodes: CodeDataType[];
  public tokens: {
    accessTokens: TokenType[];
    refreshTokens: TokenType[];
  };
  public __v: number;

  constructor(
    @Inject(UserRepository) private userRepository: UserRepository,
    @Inject(JwtService) private jwtService: JwtService,
    public id: string = 'no id',
    public login: string = 'no login',
    public email: string = 'no email',
    public passwordSalt: string = 'no salt',
    public passwordHash: string = 'no hash',
  ) {
    this._id = new ObjectId();
    this.id = id;
    this.accountData = {
      login: login,
      email: email,
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.emailConfirmation = {
      confirmationCode: this.generateCode(),
      expirationDate: this.addTime(12, 0, 0),
      isConfirmed: false,
    };
    this.emailCodes = [
      {
        code: this.emailConfirmation.confirmationCode,
        sentAt: new Date().toISOString(),
      },
    ];
    this.passwordConfirmation = {
      confirmationCode: this.generateCode(),
      expirationDate: this.addTime(12, 0, 0),
      isConfirmed: false,
    };
    this.passwordCodes = [
      {
        code: this.passwordConfirmation.confirmationCode,
        sentAt: new Date().toISOString(),
      },
    ];
    this.tokens = {
      accessTokens: [],
      refreshTokens: [],
    };
    this.__v = 0;
  }

  public async addAsyncParams(dto: UserDTO) {
    const userId = await this.userRepository.createUserId();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);
    return new User(this.userRepository, this.jwtService, userId, dto.login, dto.email, salt, hash);
  }

  private generateCode() {
    // return Math.floor(Math.random() * 10000).toString();
    return uuidv4()
  }

  private addTime(hours: number = 0, minutes: number = 0, seconds: number = 0) {
    let newDate = new Date();
    newDate.setHours(newDate.getHours() + hours);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    newDate.setSeconds(newDate.getSeconds() + seconds);
    return newDate.toISOString();
  }
}
