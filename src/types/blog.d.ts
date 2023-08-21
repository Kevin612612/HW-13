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

export type BlogOwnerInfoType = { userId: string; userLogin: string };

//BLOG VIEW TYPE WITH OWNER
export type BlogViewTypeWithOwner = BlogViewType & {
	blogOwnerInfo: BlogOwnerInfoType;
};

//BLOG DATA TYPE
export type BlogDataType = BlogViewType & {
	_id: ObjectId;
	blogOwnerInfo: BlogOwnerInfoType;
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
