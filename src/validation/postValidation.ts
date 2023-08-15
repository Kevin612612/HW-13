import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PostRepository } from '../entity_post/post.repository';

@ValidatorConstraint({ name: 'PostExists', async: true })
@Injectable()
export class PostExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(PostRepository) private postRepository: PostRepository) {}

  async validate(value: string) {
    console.log('PostExistsValidation starts performing'); // ! that string is for vercel log reading
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