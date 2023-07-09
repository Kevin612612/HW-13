import { IsAlpha, IsAlphanumeric, IsEmpty, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class BlogDTO {
  @IsString()
  @Matches(/^(?!\s*$).+/)
  @Length(1, 15)
  @IsNotEmpty()
  // @IsAlphanumeric()
  // @IsAlpha()
  // @IsNotEmpty()
  @Length(0, 15)
  name: string;

  @Length(0, 500)
  description: string;

  @Length(0, 100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}
