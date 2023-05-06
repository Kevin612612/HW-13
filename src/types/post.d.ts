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

//POST VIEW TYPE
export type PostViewType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: NewestLikesType[];
  };
};

//BLOG DATA TYPE
export type PostDataType = {
  _id: ObjectId;
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: NewestLikesType[];
  };
  userAssess: UserAssessType[];
};

//POST PAGING TYPE
export type PostsTypeSchema = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewType[];
};
