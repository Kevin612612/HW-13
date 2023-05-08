import { BlogRepository } from 'src/blog/blog.repository';
import { Controller, Inject, Get, Post, Body, Delete, Param, Query, Put, Res } from '@nestjs/common';
import { BlogDTO } from '../dto/blog.dto';
import { BlogIdDTO } from '../dto/id.dto';
import { PostDTO } from '../dto/post.dto';
import { QueryDTO } from '../dto/query.dto';
import { PostService } from '../post/post.service';
import { BlogTypeSchema } from '../types/blog';
import { BlogService } from './blog.service';
import { Response } from 'express';

@Controller('blogs')
export class BlogController {
  constructor(
    @Inject(BlogService) protected blogService: BlogService,
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
    @Inject(PostService) protected postService: PostService,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: QueryDTO): Promise<BlogTypeSchema> {
    return await this.blogService.findAll(query);
  }

  @Post()
  async createBlog(@Body() dto: BlogDTO) {
    return await this.blogService.createBlog(dto);
  }

  @Get('/:blogId/posts')
  async getPostsByBlogId(@Param() params: BlogIdDTO, @Query() query: QueryDTO, @Res() res: Response) {
    const blog = await this.blogRepository.getBlogById(params.blogId);
    if (!blog) res.sendStatus(404);
    const result = await this.postService.findAll(params.blogId, query);
    res.send(result);
  }

  @Post('/:blogId/posts')
  async createPostByBlogId(@Param() params: BlogIdDTO, @Body() dto: PostDTO, @Res() res: Response) {
    const blog = await this.blogRepository.getBlogById(params.blogId);
    if (!blog) res.sendStatus(404);
    const result =  await this.postService.createPost(params.blogId, dto);
    res.send(result);
  }

  @Get('/:blogId')
  async getBlogById(@Param() params: BlogIdDTO) {
    return await this.blogService.getBlogById(params.blogId);
  }

  @Put('/:blogId')
  async updateBlogById(@Param() params: BlogIdDTO) {
    return await this.blogService.updateBlogById(params.blogId);
  }

  @Delete('/:blogId')
  async deleteBlog(@Param() params: BlogIdDTO) {
    return await this.blogService.deleteBlog(params.blogId);
  }
}
