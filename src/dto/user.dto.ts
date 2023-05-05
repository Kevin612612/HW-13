import { Matches, MaxLength, MinLength } from 'class-validator';

export class UserDTO {
  @MinLength(3)
  @MaxLength(10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
