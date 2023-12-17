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
import { BlogIdDTO, BlogIdDTO_1, PostIdDTO } from '../dto/id.dto';
import { PostDTO } from '../entity_post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostService } from '../entity_post/post.service';
import { BlogTypeSchema, BlogViewType } from '../types/blog';
import { BlogService } from './blog.service';
import { Response } from 'express';
import { BlogDTO } from './dto/blogInputDTO';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { PostsTypeSchema } from '../types/post';
import { LogClassName } from '../decorators/logger.decorator';

@Controller('blogs')
export class BlogController {
	constructor(@Inject(BlogService) protected blogService: BlogService, @Inject(PostService) protected postService: PostService) {}

	@Get()
	@LogClassName()
	async getAllBlogs(@Query() query: QueryDTO): Promise<BlogTypeSchema> {
		return await this.blogService.findAll(query, 'user');
	}

	@Get('/:blogId/posts')
	@LogClassName()
	async getPostsByBlogId(@Param() params: BlogIdDTO, @Query() query: QueryDTO) {
		return await this.postService.findAll(query, null, params.blogId);
	}

	@Get('/:blogId')
	@LogClassName()
	async getBlogById(@Param() params: BlogIdDTO_1, @Res() res: Response) {
		const blog = await this.blogService.getBlogById(params.blogId);
		return blog ? res.send(blog) : res.sendStatus(HttpStatus.NOT_FOUND);
	}
}
