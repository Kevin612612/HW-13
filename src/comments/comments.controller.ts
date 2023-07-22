import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { CommentIdDTO, LikeStatusDTO } from '../dto/id.dto';
import { UserExtractGuard } from '../guards/extractUser.guard';
import { CommentService } from './comments.service';
import { CommentDTO } from './dto/commentsInputDTO';
import { SkipThrottle } from '@nestjs/throttler';

// changeLikeStatus
// updateCommentById
// deleteComment
// findCommentById

@SkipThrottle()
@Controller('comments')
export class CommentController {
  constructor(@Inject(CommentService) protected commentService: CommentService) {}

  //(1)
  @UseGuards(UserExtractGuard)
  @UseGuards(AuthGuardBearer)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/:commentId/like-status')
  async changeLikeStatus(@Param() params: CommentIdDTO, @Body() body: LikeStatusDTO, @Req() req) {
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    const result = await this.commentService.changeLikeStatus(params.commentId, body.likeStatus, userId);
    return true;
  }

  //(2)
  @UseGuards(UserExtractGuard)
  @UseGuards(AuthGuardBearer)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/:commentId')
  async updateCommentById(@Param() params: CommentIdDTO, @Body() body: CommentDTO, @Req() req) {
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    return await this.commentService.updateCommentById(params.commentId, body.content, userId);
  }

  //(3)
  @UseGuards(UserExtractGuard)
  @UseGuards(AuthGuardBearer)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:commentId')
  async deleteComment(@Param() params: CommentIdDTO, @Req() req) {
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    return await this.commentService.deleteComment(params.commentId, userId);
  }

  //(4)
  @UseGuards(UserExtractGuard)
  @Get('/:commentId')
  async findCommentById(@Param() params: CommentIdDTO, @Req() req, @Res() res) {
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    const comment = await this.commentService.findCommentById(params.commentId, user);
    res.send(comment);
  }
}
