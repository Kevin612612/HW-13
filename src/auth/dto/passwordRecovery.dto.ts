import { Length } from 'class-validator';

export class passwordRecoveryDTO {
  @Length(1, 10)
  email: string;
}
