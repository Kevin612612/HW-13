import { Controller, Inject, Get, Post, Body, Delete, Param, Query, Put, Res } from '@nestjs/common';
import { PostDTO } from '../dto/post.dto';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema } from '../types/post';
import { PostService } from './post.service';
import { PostIdDTO } from '../dto/id.dto';
import { Response } from 'express';
import { BlogRepository } from '../blog/blog.repository';

@Controller('posts')
export class PostController {
  constructor(
    @Inject(PostService) protected postService: PostService,
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
  ) {}

  @Get()
  async getAllPosts(@Query() query: QueryDTO): Promise<PostsTypeSchema> {
    return await this.postService.findAll(null, query);
  }

  @Post()
  async createPost(@Body() dto: PostDTO, @Res() res: Response) {
    const blog = await this.blogRepository.getBlogById(dto.blogId);
    if (!blog) res.sendStatus(404);
    const result = await this.postService.createPost(dto.blogId, dto);
    res.send(result);
  }

  @Get('/:postId')
  async getPostById(@Param() params: PostIdDTO) {
    return await this.postService.getPostById(params.postId);
  }

  @Put('/:postId')
  async updatePostById(@Param() params: PostIdDTO, @Body() post: PostDTO, @Res() res: Response) {
    const result = await this.postService.updatePostById(params.postId, post);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  }

  @Delete('/:postId')
  async deletePost(@Param() params: PostIdDTO, @Res() res: Response) {
    const result = await this.postService.deletePost(params.postId);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  }
}
