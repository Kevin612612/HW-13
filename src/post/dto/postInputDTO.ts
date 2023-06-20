import { IsOptional, Length, Validate } from 'class-validator';
import { BlogExistsValidation } from '../../validation/validation';

export class PostDTO {
  @Length(1, 30)
  title: string;

  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  @IsOptional()
  @Validate(BlogExistsValidation)
  blogId: string;
}