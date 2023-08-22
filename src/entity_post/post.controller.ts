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
	Req,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';

import { PostDTO } from './dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema } from '../types/post';
import { PostService } from './post.service';
import { LikeStatusDTO, PostIdDTO } from '../dto/id.dto';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { AuthGuardBasic } from '../guards/authBasic.guard';
import { CommentService } from '../entity_comment/comment.service';
import { CommentDTO } from '../entity_comment/dto/commentsInputDTO';

//(1) changeLikeStatus
//(2) getAllCommentsByPost
//(3) createCommentByPost
//(4) getAllPosts
//(5) createPost
//(6) findPostById
//(7) updatePostById
//(8) deletePost

@Controller('posts')
export class PostController {
	constructor(
		@Inject(PostService) protected postService: PostService,
		@Inject(CommentService) protected commentService: CommentService,
	) {}

	//(1)
	@UseGuards(AuthGuardBearer)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:postId/like-status')
	async changeLikeStatus(@Param() dto: PostIdDTO, @Body() body: LikeStatusDTO, @Req() req) {
		const user = req.user ? req.user : null;
		return await this.postService.changeLikeStatus(dto.postId, body.likeStatus, user);
	}

	//(2)
	@UseGuards(AuthGuardBearer)
	@Get('/:postId/comments')
	async getAllCommentsByPost(@Query() dto: QueryDTO, @Param() param: PostIdDTO, @Req() req): Promise<any> {
		const userId = req.user?.id || null;
		return await this.commentService.getAllCommentsByPost(dto, param.postId, userId);
	}

	//(3)
	@UseGuards(AuthGuardBearer)
	@HttpCode(HttpStatus.CREATED)
	@Post('/:postId/comments')
	async createCommentByPost(@Param() param: PostIdDTO, @Body() body: CommentDTO, @Req() req): Promise<any> {
		const userId = req.user?.id || null;
		const userName = req.user?.accountData.login || null;
		return await this.commentService.newPostedCommentByPostId(param.postId, body.content, userId, userName);
	}

	//(4)
	@Get()
	async getAllPosts(@Query() dto: QueryDTO): Promise<PostsTypeSchema> {
		return await this.postService.findAll(dto, null);
	}

	//(5)
	@UseGuards(AuthGuardBasic)
	@Post()
	async createPost(@Body() dto: PostDTO) {
		return await this.postService.createPost(dto, null);
	}

	//(6)
	@Get('/:postId')
	async findPostById(@Param() params: PostIdDTO) {
		return await this.postService.findPostById(params.postId, null);
	}

	//(7)
	@UseGuards(AuthGuardBasic)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:postId')
	async updatePostById(@Param() params: PostIdDTO, @Body() dto: PostDTO) {
		return await this.postService.updatePostById(null, params.postId, dto);
	}

	//(8)
	@UseGuards(AuthGuardBasic)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:postId')
	async deletePost(@Param() params: PostIdDTO) {
		return await this.postService.deletePost(null, null, params.postId);
	}
}
