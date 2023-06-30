import { Length, Validate } from 'class-validator';
import { UserExistsByLoginOrEmail, UserExistsValidation } from '../../validation/validation';

export class LoginDTO {
  @Validate(UserExistsByLoginOrEmail)
  @Length(1, 10)
  loginOrEmail: string;

  @Length(1, 10)
  password: string;
}
