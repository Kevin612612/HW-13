// import { ObjectId } from 'mongodb';
// import bcrypt from 'bcrypt';

// import {
//   CodeDataType,
//   ConformationType,
//   TokenType,
//   UserAccountDataType,
// } from 'src/types/users';
// import { UserModel } from './users.schema';







// export class User {
//   public _id: ObjectId;
//   public accountData: UserAccountDataType;
//   public emailConfirmation: ConformationType;
//   public emailCodes: CodeDataType[];
//   public passwordConfirmation: {
//     confirmationCode: string;
//     expirationDate: Date;
//   };
//   public passwordCodes: CodeDataType[];
//   public tokens: {
//     accessTokens: TokenType[];
//     refreshTokens: TokenType[];
//   };

//   constructor(
//     public id: string = 'no id',
//     public login: string = 'no login',
//     public email: string = 'no email',
//     public passwordSalt: string = 'no salt',
//     public passwordHash: string = 'no hash',
//   ) {
//     this._id = new ObjectId();
//     this.id = id;
//     this.accountData = {
//       login: login,
//       email: email,
//       passwordSalt: passwordSalt,
//       passwordHash: passwordHash,
//       createdAt: new Date(),
//     };
//     this.emailConfirmation = {
//       confirmationCode: this.generateCode(),
//       expirationDate: this.addTime(12, 0, 0),
//       isConfirmed: false,
//     };
//     this.emailCodes = [
//       {
//         code: this.emailConfirmation.confirmationCode,
//         sentAt: new Date(),
//       },
//     ];
//     this.passwordConfirmation = {
//       confirmationCode: this.generateCode(),
//       expirationDate: this.addTime(12, 0, 0),
//     };
//     this.passwordCodes = [
//       {
//         code: this.passwordConfirmation.confirmationCode,
//         sentAt: new Date(),
//       },
//     ];
//     this.tokens = {
//       accessTokens: [],
//       refreshTokens: [],
//     };
//   }

//   public async addAsyncParams(login: string, email: string, password: string) {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     const userId = await createUserId();
//     return new User(userId, login, email, salt, hash);
//   }

//   private generateCode() {
//     return Math.floor(Math.random() * 10000).toString();
//   }

//   private addTime(hours = 0, minutes = 0, seconds = 0) {
//     const newDate = new Date();
//     newDate.setHours(newDate.getHours() + hours);
//     newDate.setMinutes(newDate.getMinutes() + minutes);
//     newDate.setSeconds(newDate.getSeconds() + seconds);
//     return newDate;
//   }
// }

// //create userId in mongoose
// export const createUserId = async (): Promise<string> => {
//   let userId = 1;
//   while (userId) {
//     const user = await UserModel.findOne({ id: userId.toString() });
//     if (!user) {
//       break;
//     }
//     userId++;
//   }
//   return userId.toString();
// };






// export interface UserInterface {
//   _id: ObjectId;
//   accountData: UserAccountDataType;
//   emailConfirmation: ConformationType;
//   emailCodes: CodeDataType[];
//   passwordConfirmation: {
//     confirmationCode: string;
//     expirationDate: Date;
//   };
//   passwordCodes: CodeDataType[];
//   tokens: {
//     accessTokens: TokenType[];
//     refreshTokens: TokenType[];
//   };
//   id: string;
//   login: string;
//   email: string;
//   passwordSalt: string;
//   passwordHash: string;
//   addAsyncParams(login: string, email: string, password: string): Promise<User>;
// }
