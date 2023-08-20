import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import mongoose from 'mongoose';
import { UserDataType } from '../types/users';
import { Comment } from './comment.class';
import { CommentViewType } from '../types/comment';
import { QueryDTO } from '../dto/query.dto';
import { PostRepository } from '../entity_post/post.repository';
import { UserRepository } from '../entity_user/user.repository';

//(1) getAllCommentsByPost
//(2) createComment
//(3) changeLikeStatus
//(4) updateCommentById
//(5) deleteComment
//(6.1) findCommentById

@Injectable()
export class CommentService {
  constructor(
    @Inject(CommentRepository) protected commentRepository: CommentRepository,
    @Inject(PostRepository) protected postRepository: PostRepository,
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  //(1)
  async getAllCommentsByPost(query: QueryDTO, postId: string, userId: string): Promise<any> {
    const pageParams = {
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      pageNumber: query.pageNumber || 1,
      searchNameTerm: query.searchNameTerm || '',
      pageSize: query.pageSize || 10,
    };
    const allDataComments = await this.commentRepository.getAllCommentsByPost(postId, pageParams.sortBy, pageParams.sortDirection);
    const quantityOfDocs = await this.commentRepository.countAllCommentsByPost(postId);
    //filter allDataComments and return array that depends on which user send get request
    const sortedItems = allDataComments.map(obj => {
      if (obj.userAssess.find(el => el.userIdLike === userId)) {
        return {
          id: obj.id,
          content: obj.content,
          commentatorInfo: obj.commentatorInfo,
          createdAt: obj.createdAt,
          likesInfo: {
            likesCount: obj.likesInfo.likesCount,
            dislikesCount: obj.likesInfo.dislikesCount,
            myStatus: obj.userAssess.find(el => el.userIdLike === userId)?.assess ?? 'None',
          },
        };
      } else {
        return {
          id: obj.id,
          content: obj.content,
          commentatorInfo: obj.commentatorInfo,
          createdAt: obj.createdAt,
          likesInfo: {
            likesCount: obj.likesInfo.likesCount,
            dislikesCount: obj.likesInfo.dislikesCount,
            myStatus: 'None',
          },
        };
      }
    }); //if user left comment return his assess as myStatus

    return {
      pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
      page: +pageParams.pageNumber,
      pageSize: +pageParams.pageSize,
      totalCount: quantityOfDocs,
      items: sortedItems.slice((+pageParams.pageNumber - 1) * +pageParams.pageSize, +pageParams.pageNumber * +pageParams.pageSize),
    };
  }

  //(2) this method creates new comment
  async newPostedCommentByPostId(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ): Promise<any | number | string[]> {
    const foundPost = await this.postRepository.findPostById(postId);
    if (!foundPost) {
      throw new NotFoundException([`post doesn't exist`]);
    }
    //create new comment
    let newComment = new Comment(this.commentRepository); //empty comment
    newComment = await newComment.addAsyncParams(content, userId, userLogin, postId); // fill user with async params
    // put this new comment into db
    try {
      const result = await this.commentRepository.newPostedComment(newComment);
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

    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        dislikesCount: newComment.likesInfo.dislikesCount,
        likesCount: newComment.likesInfo.likesCount,
        myStatus: newComment.likesInfo.myStatus,
      },
    };
  }

  //(3) method change like status
  async changeLikeStatus(commentId: string, likeStatus: string, userId: string): Promise<boolean> {
    const comment = await this.commentRepository.findCommentByIdDbType(commentId);
    //change myStatus
    const result = await this.commentRepository.changeLikeStatus(commentId, likeStatus);
    //check whether this user left assess to this comment
    const userAssess = comment.userAssess.find(obj => obj.userIdLike === userId);
    //if he didn't leave comment -> add like/dislike/none to comment
    if (!userAssess) {
      if (likeStatus == 'Like') {
        const result1 = await this.commentRepository.addLike(comment, userId);
      }
      if (likeStatus == 'Dislike') {
        const result2 = await this.commentRepository.addDislike(comment, userId);
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
        const result1 = await this.commentRepository.deleteLike(comment, userId);
        const result2 = await this.commentRepository.addDislike(comment, userId);
        //set my status None
        const result3 = await this.commentRepository.setNone(comment);
      }
      if (assess == 'Like' && likeStatus == 'None') {
        //minus like and delete user from array
        const result1 = await this.commentRepository.deleteLike(comment, userId);
      }
      if (assess == 'Dislike' && likeStatus == 'Like') {
        //minus dislike and delete user from array then add addLike()
        const result1 = await this.commentRepository.deleteDislike(comment, userId);
        const result2 = await this.commentRepository.addLike(comment, userId);
        //set my status None
        const result3 = await this.commentRepository.setNone(comment);
      }
      if (assess == 'Dislike' && likeStatus == 'Dislike') {
        //nothing
      }
      if (assess == 'Dislike' && likeStatus == 'None') {
        //minus dislike and delete user from array
        const result1 = await this.commentRepository.deleteDislike(comment, userId);
      }
    }
    return true;
  }

  //(4) method updates comment by ID
  async updateCommentById(commentId: string, content: string, userId: string): Promise<boolean | string[]> {
    //check if it is your account
    const comment = await this.commentRepository.findCommentById(commentId);
    if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException(["it's not your account"]);
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
    return true;
  }

  //(5) method deletes comment by ID
  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    //check if it is your account
    const comment = await this.commentRepository.findCommentById(commentId);
    if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException(["it's not your account"]);
    const result = await this.commentRepository.deleteComment(commentId);
    return true;
  }

  //(6) method find comment by Id
  // async findCommentById(commentId: string, user: UserDataType): Promise<CommentViewType | number> {
  //   //find comment ->  delete myStatus if user unauthorized -> return to user or 404 if not found
  //   const comment = await this.commentRepository.findCommentByIdDbType(commentId);
  //   //hide info about likes from unauthorized user
  //   if (user == null) {
  //     comment.likesInfo.myStatus = 'None';
  //   }
  //   if (user != null) {
  //     //if user authorized -> find his like/dislike in userAssess Array in comment
  //     const assess = comment.userAssess.find(obj => obj.userIdLike === user.id)?.assess ?? null;
  //     //return comment to user with his assess if this user left like or dislike
  //     if (assess) {
  //       comment.likesInfo.myStatus = assess; //like or dislike
  //     } else {
  //       comment.likesInfo.myStatus = 'None';
  //     }
  //   }
  //   return {
  //     commentatorInfo: comment.commentatorInfo,
  //     id: comment.id,
  //     content: comment.content,
  //     createdAt: comment.createdAt,
  //     likesInfo: comment.likesInfo,
  //   };
  // }

  //(6.1) method find comment by Id
  async findCommentById(commentId: string): Promise<CommentViewType | number> {
    const comment = await this.commentRepository.findCommentByIdDbType(commentId);
    const userId = comment.commentatorInfo.userId;
    const user = await this.userRepository.findUserById(userId);
    if (user.banInfo.isBanned == true) throw new NotFoundException([[`user doesn't exist`]])
    return {
      commentatorInfo: comment.commentatorInfo,
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      likesInfo: comment.likesInfo,
    };
  }
}
