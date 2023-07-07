import { Validate } from 'class-validator';
import { CodeAlreadyConfirmed } from '../../validation/validation';

export class CodeConfirmationDTO {
  @Validate(CodeAlreadyConfirmed)
  code: string;
}