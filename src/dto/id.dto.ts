import { Validate } from "class-validator";
import { BlogExistsValidation } from "../validation/validation";

export class BlogIdDTO {
    @Validate(BlogExistsValidation, { message: 'blog doesn\'t exist' })
    blogId: string;
  }