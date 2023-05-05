import {
  Controller,
  Inject,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { BlogDTO } from 'src/dto/blog.dto';
import { BlogService } from './blog.service';
import { QueryDTO } from 'src/dto/query.dto';

@Controller('blogs')
export class BlogController {
  constructor(@Inject(BlogService) protected blogService: BlogService) {}

  @Get()
  async getAllBlogs(@Query() query: QueryDTO) {
    return await this.blogService.findAll(query);
  }

  @Post()
  async createBlog(@Body() dto: BlogDTO) {
    return await this.blogService.createBlog(dto);
  }

  @Get('/:blogId')
  async getBlogById(@Param() params: { blogId: string }) {
    return await this.blogService.getBlogById(params.blogId);
  }

  @Delete('/:blogId')
  async deleteBlog(@Param() params: { blogId: string }) {
    return await this.blogService.deleteBlog(params.blogId);
  }
}
