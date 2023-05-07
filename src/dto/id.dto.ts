import { Length, Validate } from "class-validator";
import { BlogExistsValidation } from "src/validation/validation";

export class BlogIdDTO {
    @Validate(BlogExistsValidation, { message: 'blog doesn\'t exist' })
    blogId: string;
  }