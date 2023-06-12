import { BlogRepository } from 'src/blog/blog.repository';
import {
  Controller,
  Inject,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Put,
  Res,
  UseGuards,
  HttpCode,
  NotFoundException,
  HttpStatus,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { BlogIdDTO } from '../dto/id.dto';
import { PostDTO } from '../post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostService } from '../post/post.service';
import { BlogTypeSchema } from '../types/blog';
import { BlogService } from './blog.service';
import { Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { BlogDTO } from './dto/blogInputDTO';

// @UseGuards(AuthGuard)
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
    if (!blog) res.sendStatus(HttpStatus.NOT_FOUND);
    const result = await this.postService.findAll(params.blogId, query);
    res.send(result);
  }

  @Post('/:blogId/posts')
  async createPostByBlogId(@Param() params: BlogIdDTO, @Body() dto: PostDTO, @Res() res: Response) {
    const blog = await this.blogRepository.getBlogById(params.blogId);
    if (!blog) res.sendStatus(HttpStatus.NOT_FOUND);
    const result = await this.postService.createPost(params.blogId, dto);
    res.send(result);
  }

  @Get('/:blogId')
  async getBlogById(@Param() params: BlogIdDTO, @Res() res: Response) {
    const blog = await this.blogService.getBlogById(params.blogId);
    if (!blog) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.send(blog);
    }
  }

  @Put('/:blogId')
  async updateBlogById(@Param() params: BlogIdDTO, @Body() blog: BlogDTO, @Res() res: Response) {
    const result = await this.blogService.updateBlogById(params.blogId, blog);
    if (!result) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }

  @Delete('/:blogId')
  async deleteBlog(@Param() params: BlogIdDTO) {
    return await this.blogService.deleteBlog(params.blogId);
  }
}
