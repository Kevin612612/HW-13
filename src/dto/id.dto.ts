import { IsDefined, IsEnum, IsNumberString, Validate } from 'class-validator';
import { BlogExistsValidation } from '../validation/blogValidation';
import { CommentExistsValidation } from '../validation/commentValidation';
import { DeviceExistsValidation } from '../validation/deviceValidation';
import { PostExistsValidation } from '../validation/postValidation';
import { UserExistsValidation } from '../validation/userValidation';

export class UserIdDTO {
  @IsDefined()
  @Validate(UserExistsValidation)
  userId: string;
}

export class BlogIdDTO {
  @Validate(BlogExistsValidation)
  blogId: string;
}

export class PostIdDTO {
  @Validate(PostExistsValidation)
  postId: string;
}

export class CommentIdDTO {
  @Validate(CommentExistsValidation)
  commentId: string;
}

export class DeviceIdDTO {
  @IsNumberString()
  @Validate(DeviceExistsValidation)
  deviceId: string;
}

export class LikeStatusDTO {
  @IsEnum({
    Like: 'Like',
    Dislike: 'Dislike',
    None: 'None',
  })
  likeStatus: string;
}
