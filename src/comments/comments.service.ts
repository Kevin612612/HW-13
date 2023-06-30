import { Inject, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import mongoose from 'mongoose';
import { UserDataType } from '../types/users';
import { CommentViewType } from '../types/comment';

//(1) updateCommentById
//(2) deleteComment
//(3) findCommentById
//(4) changeLikeStatus

@Injectable()
export class CommentService {
  constructor(@Inject(CommentRepository) protected commentRepository: CommentRepository) {}

  //(1) method updates comment by ID
  async updateCommentById(commentId: string, userId: string, content: string): Promise<number | string[]> {
    //check if it is your account
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) return 404;
    if (comment.commentatorInfo.userId !== userId) return 403;
    try {
      const result = await this.commentRepository.updateCommentById(commentId, content);
    } catch (err: any) {
      const validationErrors = [];
      if (err instanceof mongoose.Error.ValidationError) {
        for (const path in err.errors) {
          const error = err.errors[path].message;
          validationErrors.push(error);
        }
      }
      return validationErrors;
    }
    return 204;
  }

  //(2) method deletes comment by ID
  async deleteComment(commentId: string, userId: string): Promise<number> {
    //check if it is your account
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) return 404;
    if (comment.commentatorInfo.userId !== userId) return 403;
    const result = await this.commentRepository.deleteComment(commentId);
    return 204;
  }

  //(3) method find comment by Id
  async findCommentById(commentId: string, user: UserDataType): Promise<CommentViewType | number> {
    //find comment ->  delete myStatus if user unauthorized -> return to user or 404 if not found
    const comment = await this.commentRepository.findCommentByIdDbType(commentId);
    if (!comment) return 404;
    //hide info about likes from unauthorized user
    if (user == null) {
      comment.likesInfo.myStatus = 'None';
    }
    if (user != null) {
      //if user authorized -> find his like/dislike in userAssess Array in comment
      const assess = comment.userAssess.find(obj => obj.userIdLike === user.id)?.assess ?? null;
      //return comment to user with his assess if this user left like or dislike
      if (assess) {
        comment.likesInfo.myStatus = assess; //like or dislike
      } else {
        comment.likesInfo.myStatus = 'None';
      }
    }
    return {
      commentatorInfo: comment.commentatorInfo,
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      likesInfo: comment.likesInfo,
    };
  }

  //(4) method change like status
  async changeLikeStatus(commentId: string, likeStatus: string, user: UserDataType): Promise<number> {
    const comment = await this.commentRepository.findCommentByIdDbType(commentId);
    if (!comment) return 404;
    //change myStatus
    const result = await this.commentRepository.changeLikeStatus(commentId, likeStatus);
    //check whether this user left assess to this comment
    const userAssess = comment.userAssess.find(obj => obj.userIdLike === user.id);
    //if he didn't leave comment -> add like/dislike/none to comment
    if (!userAssess) {
      if (likeStatus == 'Like') {
        const result1 = await this.commentRepository.addLike(comment, user.id);
      }
      if (likeStatus == 'Dislike') {
        const result2 = await this.commentRepository.addDislike(comment, user.id);
      }
      if (likeStatus == 'None') {
        const result3 = await this.commentRepository.setNone(comment);
      }
    } else {
      const assess = userAssess.assess; //assess of this user
      if (assess == 'Like' && likeStatus == 'Like') {
        //nothing
      }
      if (assess == 'Like' && likeStatus == 'Dislike') {
        //minus like and delete user from array then add addDislike()
        const result1 = await this.commentRepository.deleteLike(comment, user.id);
        const result2 = await this.commentRepository.addDislike(comment, user.id);
        //set my status None
        const result3 = await this.commentRepository.setNone(comment);
      }
      if (assess == 'Like' && likeStatus == 'None') {
        //minus like and delete user from array
        const result1 = await this.commentRepository.deleteLike(comment, user.id);
      }
      if (assess == 'Dislike' && likeStatus == 'Like') {
        //minus dislike and delete user from array then add addLike()
        const result1 = await this.commentRepository.deleteDislike(comment, user.id);
        const result2 = await this.commentRepository.addLike(comment, user.id);
        //set my status None
        const result3 = await this.commentRepository.setNone(comment);
      }
      if (assess == 'Dislike' && likeStatus == 'Dislike') {
        //nothing
      }
      if (assess == 'Dislike' && likeStatus == 'None') {
        //minus dislike and delete user from array
        const result1 = await this.commentRepository.deleteDislike(comment, user.id);
      }
    }
    return 204;
  }
}
