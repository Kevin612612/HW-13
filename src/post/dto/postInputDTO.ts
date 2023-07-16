import { IsNotEmpty, IsNumberString, IsOptional, Length, Validate } from 'class-validator';
import { BlogExistsValidation } from '../../validation/validation';

export class PostDTO {
  @Length(1, 30)
  @IsNotEmpty()
  title: string;

  @Length(1, 100)
  @IsNotEmpty()
  shortDescription: string;

  @Length(1, 1000)
  @IsNotEmpty()
  content: string;

  @Validate(BlogExistsValidation)
  @IsNumberString()
  @IsOptional()
  blogId: string;
}