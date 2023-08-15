import { Validate } from 'class-validator';
import { CodeAlreadyConfirmed } from '../../validation/userValidation';

export class CodeConfirmationDTO {
  @Validate(CodeAlreadyConfirmed)
  code: string;
}