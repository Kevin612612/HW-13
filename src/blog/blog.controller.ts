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
  HttpStatus,
  Req,
  HttpCode,
} from '@nestjs/common';
import { BlogIdDTO } from '../dto/id.dto';
import { PostDTO } from '../post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostService } from '../post/post.service';
import { BlogTypeSchema, BlogViewType } from '../types/blog';
import { BlogService } from './blog.service';
import { Response } from 'express';
import { BlogDTO } from './dto/blogInputDTO';
import { BlogRepository } from './blog.repository';
import { AuthGuardBasic } from '../guards/authBasic.guard';
import { UserExtractGuard } from '../guards/extractUser.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
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

  @UseGuards(AuthGuardBasic)
  @Post()
  async createBlog(@Body() dto: BlogDTO): Promise<BlogViewType | string[]> {
    return await this.blogService.createBlog(dto);
  }

  @UseGuards(UserExtractGuard)
  @Get('/:blogId/posts')
  async getPostsByBlogId(@Param() params: BlogIdDTO, @Query() query: QueryDTO, @Req() req, @Res() res: Response) {
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    const result = await this.postService.findAll(query, userId, params.blogId);
    res.send(result);
  }

  @UseGuards(AuthGuardBasic)
  @Post('/:blogId/posts')
  async createPostByBlogId(@Param() params: BlogIdDTO, @Body() dto: PostDTO, @Res() res: Response) {
    dto.blogId = params.blogId;
    const result = await this.postService.createPost(dto);
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

  @UseGuards(AuthGuardBasic)
  @Put('/:blogId')
  async updateBlogById(@Param() params: BlogIdDTO, @Body() blog: BlogDTO, @Res() res: Response) {
    const result = await this.blogService.updateBlogById(params.blogId, blog);
    if (!result) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuardBasic)
  @Delete('/:blogId')
  async deleteBlog(@Param() params: BlogIdDTO) {
    return await this.blogService.deleteBlog(params.blogId);
  }
}
