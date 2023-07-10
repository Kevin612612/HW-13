import { CommentRepository } from './comment.repository';
import { ObjectId } from 'mongodb';
import { CommentatorInfoType, LikesInfoType, UserAssessType } from '../types/comment';
import { Inject } from '@nestjs/common';

export class Comment {
  public _id: ObjectId;
  public createdAt: string;
  public commentatorInfo: CommentatorInfoType;
  public likesInfo: LikesInfoType;
  public userAssess: UserAssessType[];

  constructor(
    @Inject(CommentRepository) private commentRepository: CommentRepository,
    public id: string = '',
    public content: string = '',
    public userId: string = '',
    public userLogin: string = '',
    public postId: string = '',
    public dislikesCount: number = 0,
    public likesCount: number = 0,
    public myStatus: string = 'None',
    public userIdLike: string = '',
    public assess: string = 'None',
    public __v: number = 0,
  ) {
    this._id = new ObjectId();
    id;
    content;
    this.commentatorInfo = {
      userId: userId,
      userLogin: userLogin,
    };
    this.createdAt = new Date().toISOString();
    this.likesInfo = {
      dislikesCount: dislikesCount,
      likesCount: likesCount,
      myStatus: myStatus,
    };
    postId;
    this.userAssess = [];
    this.__v = 0;
  }

  public async addAsyncParams(content: string, userId: string, userLogin: string, postId: string) {
    const commentId = await this.commentRepository.createCommentId();
    return new Comment(this.commentRepository, commentId, content, userId, userLogin, postId);
  }
}
