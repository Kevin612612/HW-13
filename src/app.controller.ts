import { Controller, Delete, Get, HttpCode, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { BlogRepository } from './blog/blog.repository';
import { PostRepository } from './post/post.repository';
import { UserRepository } from './user/users.repository';

@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(UserRepository) protected userRepository: UserRepository,
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
    @Inject(PostRepository) protected postRepository: PostRepository,
  ) {}

  @Get()
  hello() {
    return this.appService.getHello();
  }

  @Delete('testing/all-data')
  @HttpCode(204)
  async alldata() {
    await this.userRepository.deleteAll();
    await this.blogRepository.deleteAll();
    await this.postRepository.deleteAll();
  }
}
