import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class BlogDTO {
  @IsString()
  @Matches(/^(?!\s*$).+/)
  @Length(1, 15)
  @IsNotEmpty()
  name: string;

  @Length(0, 500)
  description: string;

  @Length(0, 100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}
