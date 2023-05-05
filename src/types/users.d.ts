import { ObjectId } from 'mongodb';

type CodeDataType = {
  code: string;
  sentAt: Date;
};

type TokenType = {
  value: string;
  createdAt: Date;
  expiredAt: Date;
};

export type UserAccountDataType = {
  login: string;
  email: string;
  passwordSalt;
  passwordHash;
  createdAt: Date;
};

export type ConformationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

//USER VIEW TYPE
export type UserViewType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

//USER DATA TYPE
export type UserDataType = {
  _id: ObjectId;
  id: string;
  accountData: UserAccountDataType;
  emailConfirmation: ConformationType;
  emailCodes: CodeDataType[];
  passwordConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
  passwordCodes: {
    code: string;
    sentAt: Date;
  }[];
  tokens: {
    accessTokens: TokenType[];
    refreshTokens: TokenType[];
  };
};

//USER PAGING TYPE
export type UserTypeSchema = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: userViewModel[];
};
