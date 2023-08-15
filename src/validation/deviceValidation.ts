import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { RefreshTokensRepository } from '../entity_tokens/refreshtoken.repository';

@ValidatorConstraint({ name: 'DeviceExists', async: true })
@Injectable()
export class DeviceExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(RefreshTokensRepository) private refreshTokensRepository: RefreshTokensRepository) {}

  async validate(value: string) {
    console.log('DeviceExistsValidation starts performing'); // ! that string is for vercel log reading
    const token = (await this.refreshTokensRepository.findTokenByDeviceId(value)) || null;
    if (!token) {
      throw new NotFoundException(["Device doesn't exist"]);
    }
    return true;
  }

  defaultMessage() {
    return `Device doesn't exist`;
  }
}
