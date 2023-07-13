import { IsDefined, IsEnum, Validate } from 'class-validator';
import { BlogExistsValidation, PostExistsValidation, UserExistsValidation } from '../validation/validation';

export class BlogIdDTO {
  @Validate(BlogExistsValidation)
  blogId: string;
}

export class PostIdDTO {
  @Validate(PostExistsValidation)
  postId: string;
}

export class UserIdDTO {
  @IsDefined()
  @Validate(UserExistsValidation)
  userId: string;
}

export class LikeStatusDTO {
  @IsEnum({
    Like: 'Like',
    Dislike: 'Dislike',
    None: 'None',
  })
  likeStatus: string;
}
