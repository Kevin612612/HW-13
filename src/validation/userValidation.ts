import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserRepository } from '../entity_user/user.repository';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async validate(value: string) {
    console.log('UserExistsValidation starts performing'); // ! that string is for vercel log reading
    const user = await this.userRepository.findUserById(value);

    if (!user) {
      throw new NotFoundException(["User doesn't exist"]);
    }
    return true;
  }

  defaultMessage() {
    return `User doesn't exist`;
  }
}

@ValidatorConstraint({ name: 'UserExistsByLoginOrEmail', async: true })
@Injectable()
export class UserExistsByLoginOrEmail implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async validate(value: string) {
    console.log('UserExistsByLoginOrEmail starts performing'); // ! that string is for vercel log reading
    const user = await this.userRepository.findUserByLoginOrEmail(value);
    if (!user) {
      throw new UnauthorizedException();
    }
    return true;
  }

  defaultMessage() {
    return `User with such login or email doesn't exist`;
  }
}

@ValidatorConstraint({ name: 'UserExistsByLogin', async: true })
@Injectable()
export class UserExistsByLogin implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async validate(value: string) {
    console.log('UserExistsByLogin starts performing'); // ! that string is for vercel log reading
    const user = await this.userRepository.findUserByLogin(value);
    if (user) {
      throw new BadRequestException([{ message: 'User with such login already exists', field: 'login' }]);
    }
    return true;
  }

  defaultMessage() {
    return `User with such login already exists`;
  }
}

@ValidatorConstraint({ name: 'UserExistsByEmail', async: true })
@Injectable()
export class UserExistsByEmail implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async validate(value: string) {
    console.log('UserExistsByEmail starts performing'); // ! that string is for vercel log reading
    const user = await this.userRepository.findUserByEmail(value);
    if (user) {
      throw new BadRequestException([{ message: 'User with such email already exists', field: 'email' }]);
    }
    return true;
  }

  defaultMessage() {
    return `User with such email already exists`;
  }
}

@ValidatorConstraint({ name: 'CodeAlreadyConfirmed', async: true })
@Injectable()
export class CodeAlreadyConfirmed implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async validate(value: string) {
    console.log('CodeAlreadyConfirmed starts performing'); // ! that string is for vercel log reading
    const user = await this.userRepository.findUserByCode(value);
    if (!user) {
      throw new BadRequestException([{ message: "User doesn't exist ", field: 'code' }]);
    }
    if (user.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([{ message: 'User already confirmed', field: 'code' }]);
    }

    return true;
  }

  defaultMessage() {
    return `User already confirmed or doesn't exist`;
  }
}

@ValidatorConstraint({ name: 'EmailAlreadyConfirmed', async: true })
@Injectable()
export class EmailAlreadyConfirmed implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async validate(value: string) {
    console.log('EmailAlreadyConfirmed starts performing'); // ! that string is for vercel log reading
    const user = await this.userRepository.findUserByEmail(value);

    if (!user) {
      throw new BadRequestException([{ message: "User doesn't exist ", field: 'email' }]);
    }
    if (user.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([{ message: 'User already confirmed', field: 'email' }]);
    }
    return true;
  }

  defaultMessage() {
    return `User already confirmed or doesn't exist`;
  }
}
