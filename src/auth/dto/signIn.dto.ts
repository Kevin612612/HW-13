import { Length } from 'class-validator';

export class SignInDTO {
  @Length(1, 10)
  loginOrEmail: string;

  @Length(1, 10)
  password: string;
}
