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

import { PostDTO } from '../post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema } from '../types/post';
import { PostService } from './post.service';
import { LikeStatusDTO, PostIdDTO } from '../dto/id.dto';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { AuthGuardBasic } from '../guards/authBasic.guard';
import { CommentService } from '../comments/comments.service';
import { CommentDTO } from '../comments/dto/commentsInputDTO';

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
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuardBearer)
  @Put('/:postId/like-status')
  async changeLikeStatus(@Param() dto: PostIdDTO, @Body() body: LikeStatusDTO, @Req() req) {
    const user = req.user || null;
    return await this.postService.changeLikeStatus(dto.postId, body.likeStatus, user);
  }

  //(2)
  @Get('/:postId/comments')
  async getAllCommentsByPost(@Query() dto: QueryDTO, @Param() param: PostIdDTO): Promise<any> {
    return await this.commentService.getAllCommentsByPost(dto, param.postId);
  }

  //(3)
  @UseGuards(AuthGuardBearer)
  @Post('/:postId/comments')
  async createCommentByPost(@Param() param: PostIdDTO, @Body() body: CommentDTO, @Req() req): Promise<any> {    
    const user = req.user || null;
    return await this.commentService.newPostedCommentByPostId(param.postId, body.content, user.id, user.accountData.login);
  }

  //(4)
  @Get()
  async getAllPosts(@Query() dto: QueryDTO, @Req() req): Promise<PostsTypeSchema> {
    const userId = req.user.id || null;
    return await this.postService.findAll(dto, userId);
  }

  //(5)
  @UseGuards(AuthGuardBasic)
  @Post()
  async createPost(@Body() dto: PostDTO) {
    return await this.postService.createPost(dto);
  }

  //(6)
  @Get('/:postId')
  async findPostById(@Param() params: PostIdDTO, @Req() req) {
    const user = req.user || null;
    const post = await this.postService.findPostById(params.postId, user);
    return post;
  }

  //(7)
  @UseGuards(AuthGuardBearer)
  @Put('/:postId')
  async updatePostById(@Param() params: PostIdDTO, @Body() dto: PostDTO) {
    return await this.postService.updatePostById(params.postId, dto);
  }

  //(8)
  @Delete('/:postId')
  async deletePost(@Param() params: PostIdDTO) {
    return await this.postService.deletePost(params.postId);
  }
}
