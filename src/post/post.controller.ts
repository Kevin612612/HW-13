import { Controller, Inject, Get, Post, Body, Delete, Param, Query, Put } from '@nestjs/common';
import { PostDTO } from '../dto/post.dto';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema } from '../types/post';
import { PostService } from './post.service';


@Controller('posts')
export class PostController {
  constructor(@Inject(PostService) protected postService: PostService) {}

  @Get()
  async getAllPosts(@Query() query: QueryDTO): Promise<PostsTypeSchema> {
    return await this.postService.findAll(null, query);
  }

  @Post()
  async createPost(@Body() dto: PostDTO) {
    return await this.postService.createPost(undefined, dto);
  }

  @Get('/:postId')
  async getPostById(@Param() params: { postId: string }) {
    return await this.postService.getPostById(params.postId);
  }

  @Put('/:postId')
  async updatePostById(@Param() params: { postId: string }) {
    return await this.postService.updatePostById(params.postId);
  }

  @Delete('/:postId')
  async deletePost(@Param() params: { postId: string }) {
    return await this.postService.deletePost(params.postId);
  }
}
