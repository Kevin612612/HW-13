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
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { PostsTypeSchema } from '../types/post';

@SkipThrottle()
@Controller('blogger/blogs')
export class BloggerController {
	constructor(@Inject(BlogService) protected blogService: BlogService, @Inject(PostService) protected postService: PostService) {}

	@UseGuards(AuthGuardBearer)
	@Put('/:blogId')
	async updateBlogById(@Param() params: BlogIdDTO_1, @Body() blogDto: BlogDTO, @Req() req, @Res() res) {
		const userId = req.user?.id || null;
		const result = await this.blogService.updateBlogById(params.blogId, userId, blogDto);
		return result ? res.sendStatus(HttpStatus.NO_CONTENT) : res.sendStatus(HttpStatus.NOT_FOUND);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(AuthGuardBearer)
	@Delete('/:blogId')
	async deleteBlog(@Param() params: BlogIdDTO_1, @Req() req) {
		const userId = req.user?.id || null;
		return await this.blogService.deleteBlog(params.blogId, userId);
	}

	@UseGuards(AuthGuardBearer)
	@Post()
	async createBlog(@Body() dto: BlogDTO, @Req() req): Promise<BlogViewType | string[]> {
		const userId = req.user?.id || null;
		const userLogin = req.user?.accountData.login || null;
		const blogOwnerInfo = {userId: userId, userLogin: userLogin}
		return await this.blogService.createBlog(dto, blogOwnerInfo);
	}

	@UseGuards(AuthGuardBearer)
	@Get()
	async getAllBlogs(@Query() query: QueryDTO, @Req() req): Promise<BlogTypeSchema> {
		const userLogin = req.user?.accountData.login || null;
		return await this.blogService.findAll(query, 'blogger', userLogin);
	}

	@UseGuards(AuthGuardBearer)
	@Post('/:blogId/posts')
	async createPostByBlogId(@Param() params: BlogIdDTO_1, @Body() dto: PostDTO,  @Req() req, @Res() res) {
		const userLogin = req.user?.accountData.login || null;
		dto.blogId = params.blogId;
		const result = await this.postService.createPost(dto, userLogin);
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
	async getBlogById(@Param() params: BlogIdDTO_1, @Res() res: Response) {
		const blog = await this.blogService.getBlogById(params.blogId);
		return blog ? res.send(blog) : res.sendStatus(HttpStatus.NOT_FOUND);
	}

	@UseGuards(AuthGuardBearer)
	@Get('/:blogId/posts')
	async getAllPosts(@Query() dto: QueryDTO, @Param() blogId: BlogIdDTO, @Req() req): Promise<PostsTypeSchema> {
		const userId = req.user?.id || null;
		return await this.postService.findAll(dto, userId, blogId.blogId);
	}

	@UseGuards(AuthGuardBearer)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:blogId/posts/:postId')
	async updatePostById(@Param() blogId: BlogIdDTO_1, @Param() postId: PostIdDTO, @Body() dto: PostDTO, @Req() req) {
		const userLogin = req.user?.accountData.login || null;
		return await this.postService.updatePostById(userLogin, postId.postId, dto, blogId.blogId);
	}

	@UseGuards(AuthGuardBearer)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:blogId/posts/:postId')
	async deletePost(@Param() blogId: BlogIdDTO_1, @Param() params: PostIdDTO, @Req() req) {
		const userLogin = req.user?.accountData.login || null;
		return await this.postService.deletePost(userLogin, blogId.blogId, params.postId);
	}
}

@SkipThrottle()
@Controller('blogs')
export class BlogController {
	constructor(@Inject(BlogService) protected blogService: BlogService, @Inject(PostService) protected postService: PostService) {}

	@Get()
	async getAllBlogs(@Query() query: QueryDTO): Promise<BlogTypeSchema> {
		return await this.blogService.findAll(query, 'user');
	}

	@Get('/:blogId/posts')
	async getPostsByBlogId(@Param() params: BlogIdDTO, @Query() query: QueryDTO) {
		return await this.postService.findAll(query, null, params.blogId);
	}

	@Get('/:blogId')
	async getBlogById(@Param() params: BlogIdDTO_1, @Res() res: Response) {
		const blog = await this.blogService.getBlogById(params.blogId);
		return blog ? res.send(blog) : res.sendStatus(HttpStatus.NOT_FOUND);
	}
}
