import { IsDefined, IsNumber, Validate } from 'class-validator';
import { BlogExistsValidation, PostExistsValidation, UserExistsValidation } from '../validation/validation';

export class BlogIdDTO {
  @Validate(BlogExistsValidation)
  blogId: string;
}

export class PostIdDTO {
  @IsDefined()
  @Validate(PostExistsValidation)
  postId: string;
}

export class UserIdDTO {
  @IsDefined()
  @Validate(UserExistsValidation)
  userId: string;
}
