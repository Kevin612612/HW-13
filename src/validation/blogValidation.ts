import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BlogRepository } from '../entity_blog/blog.repository';

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(BlogRepository) private blogRepository: BlogRepository) {}

  async validate(value: string) {
    console.log('BlogExistsValidation starts performing'); // ! that string is for vercel log reading
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
