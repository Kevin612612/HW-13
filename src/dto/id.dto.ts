import { IsDefined, IsEnum, IsNumberString, Validate } from 'class-validator';
import { BlogExistsValidation, PostExistsValidation, UserExistsValidation } from '../validation/validation';

export class BlogIdDTO {
  @Validate(BlogExistsValidation)
  @IsNumberString()
  blogId: string;
}

export class PostIdDTO {
  @Validate(PostExistsValidation)
  @IsNumberString()
  postId: string;
}

export class UserIdDTO {
  @IsDefined()
  @Validate(UserExistsValidation)
  @IsNumberString()
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
