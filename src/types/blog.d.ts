import { ObjectId } from 'mongodb';

export type BlogOwnerInfoType = { userId: string; userLogin: string };

export type BlogBanInfoType = {
	isBanned: boolean;
	banDate: string;
};

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
export type BlogViewTypeForSA= BlogViewType & {
	blogOwnerInfo: BlogOwnerInfoType;
	banInfo: BlogBanInfoType;
};

//BLOG DATA TYPE
export type BlogDataType = BlogViewType & {
	_id: ObjectId;
	blogOwnerInfo: BlogOwnerInfoType;
	banInfo: BlogBanInfoType;
	__v: number;
};

//BLOG PAGING TYPE
export type BlogTypeSchema = PageTypeSchema<BlogViewType | BlogViewTypeForSA>
