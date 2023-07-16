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
  Res,
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
import { Request } from 'express';
import { Response } from 'express';
import { UserExtractGuard } from '../guards/extractUser.guard';


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
  @UseGuards(UserExtractGuard)
  @UseGuards(AuthGuardBearer)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/:postId/like-status')
  async changeLikeStatus(@Param() dto: PostIdDTO, @Body() body: LikeStatusDTO, @Req() req) {
    const user = req.user ? req.user : null;
    const result = await this.postService.changeLikeStatus(dto.postId, body.likeStatus, user);
    return true;
  }

  //(2)
  @Get('/:postId/comments')
  async getAllCommentsByPost(@Query() dto: QueryDTO, @Param() param: PostIdDTO): Promise<any> {
    return await this.commentService.getAllCommentsByPost(dto, param.postId);
  }

  //(3)
  @UseGuards(UserExtractGuard)
  @UseGuards(AuthGuardBearer)
  @HttpCode(HttpStatus.CREATED)
  @Post('/:postId/comments')
  async createCommentByPost(@Param() param: PostIdDTO, @Body() body: CommentDTO, @Req() req): Promise<any> {
    const user = req.user ? req.user : null;
    return await this.commentService.newPostedCommentByPostId(param.postId, body.content, user.id, user.accountData.login);
  }

  //(4)
  @UseGuards(UserExtractGuard)
  @Get()
  async getAllPosts(@Query() dto: QueryDTO, @Req() req: Request): Promise<PostsTypeSchema> {
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    const result = await this.postService.findAll(dto, userId);
    return result;
  }

  //(5)
  @UseGuards(AuthGuardBasic)
  @Post()
  async createPost(@Body() dto: PostDTO) {
    return await this.postService.createPost(dto);
  }

  //(6)
  @UseGuards(UserExtractGuard)
  @Get('/:postId')
  async findPostById(@Param() params: PostIdDTO, @Req() req: Request, @Res() res: Response) {
    const user = req.user ? req.user : null;
    const post = await this.postService.findPostById(params.postId, user);
    res.send(post);
  }

  //(7)
  @UseGuards(AuthGuardBasic)
  @Put('/:postId')
  async updatePostById(@Param() params: PostIdDTO, @Body() dto: PostDTO) {
    return await this.postService.updatePostById(params.postId, dto);
  }

  //(8)
  @UseGuards(AuthGuardBasic)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:postId')
  async deletePost(@Param() params: PostIdDTO) {
    return await this.postService.deletePost(params.postId);
  }
}
