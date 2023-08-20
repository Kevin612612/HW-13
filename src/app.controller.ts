import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { BlogRepository } from './entity_blog/blog.repository';
import { PostRepository } from './entity_post/post.repository';
import { UserRepository } from './entity_user/user.repository';
import { RefreshTokensRepository } from './entity_tokens/refreshtoken.repository';
import { CommentRepository } from './entity_comment/comment.repository';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogService } from './entity_blog/blog.service';
import { UsersService } from './entity_user/user.service';
import { QueryDTO, QueryUserDTO } from './dto/query.dto';
import { BlogTypeSchema } from './types/blog';
import { BlogIdDTO, UserIdDTO } from './dto/id.dto';
import { AuthGuardBasic } from './guards/authBasic.guard';
import { LogFunctionName } from './decorators/logger.decorator';
import { BanDTO, UserDTO } from './entity_user/dto/userInputDTO';
import { UserTypeSchema, UserViewType } from './types/users';

@SkipThrottle()
@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(UserRepository) protected userRepository: UserRepository,
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
    @Inject(PostRepository) protected postRepository: PostRepository,
    @Inject(RefreshTokensRepository) protected refreshTokensRepository: RefreshTokensRepository,
    @Inject(CommentRepository) protected commentRepository: CommentRepository,
  ) {}

  @Get()
  hello() {
    return this.appService.getHello();
  }

  @Delete('testing/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async allData() {
    await this.userRepository.deleteAll();
    await this.blogRepository.deleteAll();
    await this.postRepository.deleteAll();
    await this.refreshTokensRepository.deleteAll();
    await this.commentRepository.deleteAll();
  }
}

