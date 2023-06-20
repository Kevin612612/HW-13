import { ObjectId } from 'mongodb';

export enum Assess {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export type UserAssessType = {
  userIdLike: string;
  assess: keyof typeof Assess;
};

export type CommentatorInfoType ={
  userId: string;
  userLogin: string;
};

export type LikesInfoType = {
  dislikesCount: number;
  likesCount: number;
  myStatus: string;
};

//################################################################################################################

//COMMENT VIEW TYPE
export type CommentViewType = {
  commentatorInfo: CommentatorInfoType;
  id: string;
  content: string;
  createdAt: string;
  likesInfo: LikesInfoType;
};

//COMMENT DATA TYPE
export type CommentDataType = {
  _id: ObjectId;
  commentatorInfo: CommentatorInfoType;
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  likesInfo: LikesInfoType;
  userAssess: UserAssessType[];
  __v: number;
};

//COMMENT PAGING TYPE
export type CommentsTypeSchema = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewType[];
};