import { Length, Matches, Validate } from 'class-validator';
import { UserExistsByLogin, UserExistsByEmail } from '../../validation/userValidation';

export class UserDTO {
  @Validate(UserExistsByLogin)
  @Length(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;

  @Length(6, 20)
  password: string;

  @Validate(UserExistsByEmail)
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}