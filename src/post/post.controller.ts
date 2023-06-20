import { Controller, Inject, Get, Post, Body, Delete, Param, Query, Put, Res, Req } from '@nestjs/common';
import { PostDTO } from '../post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema } from '../types/post';
import { PostService } from './post.service';
import { PostIdDTO } from '../dto/id.dto';
import { Response } from 'express';
import { BlogRepository } from '../blog/blog.repository';

@Controller('posts')
export class PostController {
  constructor(
    @Inject(PostService) protected postService: PostService ) {}

  @Get()
  async getAllPosts(@Query() query: QueryDTO, @Req() req): Promise<PostsTypeSchema> {
    const userId = req.user.id || null;
    return await this.postService.findAll(query, userId);
  }

  @Post()
  async createPost(@Body() dto: PostDTO) {
    return await this.postService.createPost(dto);
  }

  @Get('/:postId')
  async findPostById(@Param() params: PostIdDTO, @Req() req) {
    const user = req.user || null;
    const post = await this.postService.findPostById(params.postId, user);
    return post;
  }

  @Put('/:postId')
  async updatePostById(@Param() params: PostIdDTO, @Body() dto: PostDTO) {
    return await this.postService.updatePostById(params.postId, dto);
  }

  @Delete('/:postId')
  async deletePost(@Param() params: PostIdDTO) {
    return await this.postService.deletePost(params.postId);
  }
}
