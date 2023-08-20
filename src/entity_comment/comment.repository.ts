import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument } from './comment.schema';
import { CommentDataType } from '../types/comment';
import { Comment } from './comment.schema';

//(1)   allComments
//(2)   newPostedComment
//(3)   updateCommentById
//(4)   deleteComment
//(5)   findCommentById
//(5.1) findCommentByIdDbType
//(6)   changeLikeStatus
//(7)   addLike
//(7.1) deleteLike
//(8)   addDislike
//(8.1) deleteDislike
//(9)   setNone
//(10)  addNone

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async createCommentId() {
    let commentId = 1;
    while (commentId) {
      const comment = await this.commentModel.findOne({ id: commentId.toString() });
      if (!comment) break;
      commentId++;
    }
    return commentId.toString();
  }

  //(1) method returns comments by postId
  async getAllCommentsByPost(postId: string, sortBy: any, sortDirection: any): Promise<any[]> {
    const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
    return this.commentModel
      .find({ postId: postId })
      .lean()
      .sort({ [sortBy]: order })
      .select({ _id: 0, __v: 0 }); //postId: 0, userAssess: 0
  }

  //(1.1) count of all comments
  async countAllCommentsByPost(postId: string): Promise<number> {
    return await this.commentModel.countDocuments({ postId: postId });
  }

  //(2) method create new comment
  async newPostedComment(newComment: any): Promise<boolean> {
    const result = await this.commentModel.insertMany(newComment);
    return true;
  }

  //(3) method update comment by Id
  async updateCommentById(commentId: string, content: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: commentId },
      {
        $set: {
          content: content,
        },
      },
    );
    return result.matchedCount === 1;
  }

  //(4) method delete comment by Id
  async deleteComment(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }

  //(5) method returns comment by Id as view model
  async findCommentById(id: string): Promise<any | undefined | null> {
    return this.commentModel.findOne({ id: id }).select({ _id: 0, __v: 0, postId: 0 });
  }

  //(5-1) method returns comment by Id as data model
  async findCommentByIdDbType(id: string): Promise<CommentDataType> {
    return this.commentModel.findOne({ id: id }).lean();
  }

  //(6) method change like status by Id
  async changeLikeStatus(id: string, likeStatus: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: id },
      {
        $set: {
          'likesInfo.myStatus': likeStatus,
        },
      },
    );
    return result.matchedCount === 1;
  }

  //(7) add like
  async addLike(comment: CommentDataType, userId: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: comment.id },
      {
        $set: {
          'likesInfo.likesCount': comment!.likesInfo.likesCount + 1,
        },
        $push: { userAssess: { userIdLike: userId, assess: 'Like' } },
      },
    );
    return result.matchedCount === 1;
  }

  //(7-1) delete like
  async deleteLike(comment: CommentDataType, userId: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: comment.id },
      {
        $set: {
          'likesInfo.likesCount': comment.likesInfo.likesCount - 1,
        },
        $pull: { userAssess: { userIdLike: userId, assess: 'Like' } },
      },
    );
    return result.matchedCount === 1;
  }

  //(8) add disLike
  async addDislike(comment: CommentDataType, userId: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: comment.id },
      {
        $set: {
          'likesInfo.dislikesCount': comment!.likesInfo.dislikesCount + 1,
        },
        $push: { userAssess: { userIdLike: userId, assess: 'Dislike' } },
      },
    );
    return result.matchedCount === 1;
  }

  //(8-1) delete disLike
  async deleteDislike(comment: CommentDataType, userId: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: comment.id },
      {
        $set: {
          'likesInfo.dislikesCount': comment!.likesInfo.dislikesCount - 1,
        },
        $pull: { userAssess: { userIdLike: userId, assess: 'Dislike' } },
      },
    );
    return result.matchedCount === 1;
  }

  //(9) set myStatus None
  async setNone(comment: CommentDataType): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: comment.id },
      {
        $set: {
          'likesInfo.myStatus': 'None',
        },
      },
    );
    return result.matchedCount === 1;
  }

  //(10) add None
  async addNone(comment: CommentDataType, userId: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: comment.id },
      {
        $push: { userAssess: { userIdLike: userId, assess: 'None' } },
      },
    );
    return result.matchedCount === 1;
  }

  //() delete all posts
  async deleteAll(): Promise<number> {
    const result = await this.commentModel.deleteMany({});
    return result.deletedCount;
  }
}
