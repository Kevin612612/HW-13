import { ObjectId } from 'mongodb';

//BLOG VIEW TYPE
export type BlogViewType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

//BLOG DATA TYPE
export type BlogDataType = {
  _id: ObjectId;
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

//BLOG PAGING TYPE
export type BlogTypeSchema = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewType[];
};
