import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class PostDTO {
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @MinLength(1)
  @MaxLength(100)
  shortDescription: string;

  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @IsOptional()
  blogId: string;
}
