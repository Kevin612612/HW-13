import { Controller, Inject, Get, Post, Body, Delete, Param, Query, Put, Req, UseGuards, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { PostDTO } from '../post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema } from '../types/post';
import { PostService } from './post.service';
import { LikeStatusDTO, PostIdDTO } from '../dto/id.dto';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { AuthGuardBasic } from '../guards/authBasic.guard';

@Controller('posts')
export class PostController {
  constructor(@Inject(PostService) protected postService: PostService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuardBearer)
  @Put('/:postId/like-status')
  async changeLikeStatus(@Param() dto: PostIdDTO, @Body() body: LikeStatusDTO, @Req() req) {
    const user = req.user || null;
    return await this.postService.changeLikeStatus(dto.postId, body.likeStatus, user);
  }

  @Get()
  async getAllPosts(@Query() query: QueryDTO, @Req() req): Promise<PostsTypeSchema> {
    const userId = req.user.id || null;
    return await this.postService.findAll(query, userId);
  }

  @UseGuards(AuthGuardBasic)
  @Post()
  async createPost(@Body() dto: PostDTO) {
    return await this.postService.createPost(dto);
  }

  @Get('/:postId')
  async findPostById(@Param() params: PostIdDTO, @Req() req) {
    const user = req.user || null;
    const post = await this.postService.findPostById(params.postId, user);
    return post;
  }

  @UseGuards(AuthGuardBearer)
  @Put('/:postId')
  async updatePostById(@Param() params: PostIdDTO, @Body() dto: PostDTO) {
    return await this.postService.updatePostById(params.postId, dto);
  }

  @Delete('/:postId')
  async deletePost(@Param() params: PostIdDTO) {
    return await this.postService.deletePost(params.postId);
  }
}
