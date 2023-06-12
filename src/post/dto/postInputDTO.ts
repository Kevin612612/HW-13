import { IsOptional, Length } from 'class-validator';

export class PostDTO {
  @Length(1, 30)
  title: string;

  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  @IsOptional()
  blogId: string;
}