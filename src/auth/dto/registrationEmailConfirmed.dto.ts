import { Matches, Validate } from 'class-validator';
import { EmailAlreadyConfirmed } from '../../validation/userValidation';

export class EmailResendDTO {
  @Validate(EmailAlreadyConfirmed)
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}