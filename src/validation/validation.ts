import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { BlogRepository } from '../blog/blog.repository';
import { UserRepository } from '../user/users.repository';
import { PostRepository } from '../post/post.repository';

@ValidatorConstraint({ name: 'customValidation', async: false })
export class CustomValidation implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    return value >= 1; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return `${args} is less than 1`;
  }
}

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(BlogRepository) private blogRepository: BlogRepository) {}

  async validate(value: string) {
    const blog = await this.blogRepository.getBlogById(value);
    if (!blog) {
      throw new NotFoundException(["Blog doesn't exist"]);
    }
    return true;
  }

  defaultMessage() {
    return `Blog doesn't exist`;
  }
}

@ValidatorConstraint({ name: 'PostExists', async: true })
@Injectable()
export class PostExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(PostRepository) private postRepository: PostRepository) {}

  async validate(value: string) {
    const post = await this.postRepository.findPostById(value);
    if (!post) {
      throw new NotFoundException(["Post doesn't exist"]);
    }
    return true;
  }

  defaultMessage() {
    return `Post doesn't exist`;
  }
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async validate(value: string) {
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
