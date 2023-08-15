import { ExtendedLikesInfo } from '../entity_post/post.schema';
import { ObjectId } from 'mongodb';

export type NewestLikesType = {
  userId: string;
  login: string;
  addedAt: string;
};

export enum Assess {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export type UserAssessType = {
  userIdLike: string;
  assess: keyof typeof Assess;
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikesType[];
};

//################################################################################################################

//POST VIEW TYPE
// export type PostLightViewType = {
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
// };

//POST VIEW TYPE
export type PostViewType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;
};

//POST DATA TYPE
export type PostDataType = {
  _id: ObjectId;
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;
  userAssess: UserAssessType[];
  __v: number;
};

//POST PAGING TYPE
export type PostsTypeSchema = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewType[];
};
