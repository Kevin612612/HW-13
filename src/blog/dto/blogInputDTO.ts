import { Length, Matches } from 'class-validator';

export class BlogDTO {
  @Length(0, 15)
  @Matches('^[a-zA-Z0-9_-]*$')
  name: string;

  @Length(0, 500)
  description: string;

  @Length(0, 100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}
