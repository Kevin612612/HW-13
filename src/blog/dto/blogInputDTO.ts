import { IsAlpha, IsAlphanumeric, IsEmpty, IsNotEmpty, Length, Matches } from 'class-validator';

export class BlogDTO {
  // @Matches(/^[a-zA-Z0-9_-]*$/)
  // @IsAlphanumeric()
  @IsAlpha()
  @IsNotEmpty()
  @Length(0, 15)
  name: string;

  @Length(0, 500)
  description: string;

  @Length(0, 100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}
