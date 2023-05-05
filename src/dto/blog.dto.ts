import { Matches, MaxLength, MinLength } from "class-validator";

export class BlogDTO {
  @MinLength(1)
  @MaxLength(15)
  name: string;

  @MinLength(1)
  @MaxLength(500)
  description: string;
  
  @MinLength(1)
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
  websiteUrl: string;
}
