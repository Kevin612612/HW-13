import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CommentRepository } from '../entity_comment/comment.repository';


@ValidatorConstraint({ name: 'CommentExists', async: true })
@Injectable()
export class CommentExistsValidation implements ValidatorConstraintInterface {
  constructor(@Inject(CommentRepository) private commentRepository: CommentRepository) {}

  async validate(value: string) {
    console.log('CommentExistsValidation starts performing'); // ! that string is for vercel log reading
    const comment = await this.commentRepository.findCommentById(value);
    if (!comment) {
      throw new NotFoundException(["Comment doesn't exist"]);
    }
    return true;
  }

  defaultMessage() {
    return `Comment doesn't exist`;
  }
}