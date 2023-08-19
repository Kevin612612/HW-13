import { UserAccountData } from './../entity_user/user.schema';
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
import { BlogIdDTO, PostIdDTO } from '../dto/id.dto';
import { PostDTO } from '../entity_post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostService } from '../entity_post/post.service';
import { BlogTypeSchema, BlogViewType } from '../types/blog';
import { BlogService } from './blog.service';
import { Response } from 'express';
import { BlogDTO } from './dto/blogInputDTO';
import { BlogRepository } from './blog.repository';
import { AuthGuardBasic } from '../guards/authBasic.guard';
import { UserExtractGuard } from '../guards/extractUser.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuardBearer } from '../guards/authBearer.guard';

@SkipThrottle()
@Controller('blogger/blogs')
export class BlogController {
	constructor(
		@Inject(BlogService) protected blogService: BlogService,
		@Inject(BlogRepository) protected blogRepository: BlogRepository,
		@Inject(PostService) protected postService: PostService,
	) {}

	@UseGuards(AuthGuardBearer)
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
	@UseGuards(AuthGuardBearer)
	@Delete('/:blogId')
	async deleteBlog(@Param() params: BlogIdDTO) {
		return await this.blogService.deleteBlog(params.blogId);
	}

	@UseGuards(AuthGuardBearer)
	@Post()
	async createBlog(@Body() dto: BlogDTO): Promise<BlogViewType | string[]> {
		return await this.blogService.createBlog(dto);
	}

	@UseGuards(AuthGuardBearer)
	@Get()
	async getAllBlogs(@Query() query: QueryDTO, @Req() req, @Res() res): Promise<BlogTypeSchema> {
		const user = req.user ? req.user : null;
		const userName = user ? user.accountData.login : null;
		return await this.blogService.findAll(query, userName);
	}

	@UseGuards(AuthGuardBearer)
	@Post('/:blogId/posts')
	async createPostByBlogId(@Param() params: BlogIdDTO, @Body() dto: PostDTO, @Res() res: Response) {
		dto.blogId = params.blogId;
		const result = await this.postService.createPost(dto);
		res.send(result);
	}

	@UseGuards(AuthGuardBearer)
	@Get('/:blogId/posts')
	async getPostsByBlogId(@Param() params: BlogIdDTO, @Query() query: QueryDTO, @Req() req, @Res() res: Response) {
		const user = req.user ? req.user : null;
		const userId = user ? user.id : null;
		const result = await this.postService.findAll(query, userId, params.blogId);
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

	@UseGuards(AuthGuardBearer)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:blogId/posts/:postId')
	async updatePostById(@Param() blogId: BlogIdDTO, @Param() postId: PostIdDTO, @Body() dto: PostDTO) {
		return await this.postService.updatePostById(postId.postId, dto);
	}
}
