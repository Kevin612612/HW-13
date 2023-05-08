import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { BlogRepository } from '../blog/blog.repository';

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
  constructor(private blogRepository: BlogRepository) {}

  async validate(value: string) {
    const blog = await this.blogRepository.getBlogById(value);
    if (!blog) return false;
    return true;
  }
}
