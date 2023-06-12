import { IsDefined, IsNumber, Validate } from 'class-validator';
import { BlogExistsValidation } from '../validation/validation';

export class BlogIdDTO {
  @Validate(BlogExistsValidation, { message: 'blog doesn\'t exist according to search' })
  blogId: string;
}

export class PostIdDTO {
  @IsDefined()
  postId: string;
}

export class UserIdDTO {
  @IsDefined()
  userId: string;
}
