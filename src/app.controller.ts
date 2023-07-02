import { Controller, Delete, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { BlogRepository } from './blog/blog.repository';
import { PostRepository } from './post/post.repository';
import { UserRepository } from './user/users.repository';
import { RefreshTokensRepository } from './tokens/refreshtoken.repository';

@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(UserRepository) protected userRepository: UserRepository,
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
    @Inject(PostRepository) protected postRepository: PostRepository,
    @Inject(RefreshTokensRepository) protected refreshTokensRepository: RefreshTokensRepository,
  ) {}

  @Get()
  hello() {
    return this.appService.getHello();
  }

  @Delete('testing/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async alldata() {
    await this.userRepository.deleteAll();
    await this.blogRepository.deleteAll();
    await this.postRepository.deleteAll();
    await this.refreshTokensRepository.deleteAll();
  }
}
