import { ObjectId } from 'mongodb';

//################################################################################################################

//BLOG VIEW TYPE
export type BlogViewType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

//BLOG VIEW TYPE WITH OWNER
export type BlogViewTypeWithOwner = BlogViewType & {
  owner: string;
};

//BLOG DATA TYPE
export type BlogDataType = BlogViewType & {
  _id: ObjectId;
  owner: string;
  __v: number;
};

//BLOG PAGING TYPE
export type BlogTypeSchema = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewType[];
};
