import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { PostDTO } from './dto/postInputDTO';
import { PostDataType, PostViewType, PostViewTypeWithAssesses } from '../types/post';
import { BlogViewTypeWithOwner } from '../types/blog';

//(1)   method returns all posts
//(2)   count of all posts
//(3)   method creates new post
//(4)   method returns post by ID as View Model
//(4.1) method returns post by ID as Data Model
//(5)   method updates post by ID
//(6)   method deletes post by ID
//(7)   method changes like status by ID
//(8)   add like
//(8.1) delete like
//(9)   add disLike
//(9.1) delete disLike
//(10)  set myStatus None
//(11)  add None
//(12)  delete all posts

@Injectable()
export class PostRepository {
	constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

	async createPostId() {
		let postId = 1;
		while (postId) {
			const post = await this.postModel.findOne({ id: postId.toString() });
			if (!post) {
				break;
			}
			postId++;
		}
		return postId.toString();
	}

	//(1) method returns all posts
	async findAll(filter: any, sortBy: string, sortDirection: string): Promise<PostViewTypeWithAssesses[]> {
		const order = sortDirection == 'asc' ? 1 : -1;
		const result = await this.postModel
			.find(filter)
			.sort({ [sortBy]: order })
			.select({ _id: 0, __v: 0 })
			.lean()
			.exec();
		return result;
	}

	//(2) count of all posts
	async countAllPosts(filter: any): Promise<number> {
		const result = await this.postModel.countDocuments(filter);
		return result;
	}

	//(3) method creates new post
	async createPost(postObject: any): Promise<PostDataType | undefined> {
		const createdPost = new this.postModel(postObject);
		return await createdPost.save();
	}

	//(4) method returns post by ID as View Model
	async findPostById(postId: string): Promise<PostViewType | undefined | null> {
		const result = await this.postModel.findOne({ id: postId }).select({ _id: 0, userAssess: 0, __v: 0 }).exec();
		return result;
	}

	//(4.1) method returns post by ID as Data Model
	async findPostByIdDbType(postId: string): Promise<PostDataType | undefined> {
		return await this.postModel.findOne({ id: postId }).lean();
	}

	//(5) method updates post by ID
	async updatePostById(postId: string, dto: PostDTO, blog: BlogViewTypeWithOwner): Promise<number> {
		const result = await this.postModel.updateOne(
			{ id: postId },
			{
				$set: {
					title: dto.title,
					shortDescription: dto.shortDescription,
					content: dto.content,
					blogId: blog.id,
					blogName: blog.name,
				},
			},
		);
		return result.modifiedCount;
	}

	//(6) method deletes post by ID
	async deletePostById(postId: string): Promise<number> {
		const result = await this.postModel.deleteOne({ id: postId });
		return result.deletedCount;
	}

	//(7) method changes like status by ID
	async changeLikeStatus(postId: string, likeStatus: string): Promise<boolean> {
		const result = await this.postModel.updateOne(
			{ id: postId },
			{
				$set: {
					'extendedLikesInfo.myStatus': likeStatus,
				},
			},
		);
		return result.modifiedCount === 1;
	}

	//(8) add like
	async addLike(post: any, user: any): Promise<boolean> {
		const result = await this.postModel.updateOne(
			{ id: post.id },
			{
				$set: {
					'extendedLikesInfo.likesCount': post.extendedLikesInfo.likesCount + 1,
				},
				$push: {
					userAssess: { userIdLike: user.id, assess: 'Like' },
					'extendedLikesInfo.newestLikes': {
						userId: user.id,
						login: user.accountData.login,
						addedAt: new Date().toISOString(),
					},
				},
			},
		);
		return result.matchedCount === 1;
	}

	//(8.1) delete like
	async deleteLike(post: any, userId: string): Promise<boolean> {
		const result = await this.postModel.updateOne(
			{ id: post.id },
			{
				$set: {
					'extendedLikesInfo.likesCount': post.extendedLikesInfo.likesCount - 1,
				},
				$pull: {
					userAssess: { userIdLike: userId, assess: 'Like' },
					'extendedLikesInfo.newestLikes': { userId: userId },
				},
			},
		);
		return result.matchedCount === 1;
	}

	//(9) add disLike
	async addDislike(post: any, userId: string): Promise<boolean> {
		const result = await this.postModel.updateOne(
			{ id: post.id },
			{
				$set: {
					'extendedLikesInfo.dislikesCount': post.extendedLikesInfo.dislikesCount + 1,
				},
				$push: { userAssess: { userIdLike: userId, assess: 'Dislike' } },
			},
		);
		return result.matchedCount === 1;
	}

	//(9.1) delete disLike
	async deleteDislike(post: any, userId: string): Promise<boolean> {
		const result = await this.postModel.updateOne(
			{ id: post.id },
			{
				$set: {
					'extendedLikesInfo.dislikesCount': post.extendedLikesInfo.dislikesCount - 1,
				},
				$pull: { userAssess: { userIdLike: userId, assess: 'Dislike' } },
			},
		);
		return result.matchedCount === 1;
	}

	//(10) set myStatus None
	async setNone(post: any): Promise<boolean> {
		const result = await this.postModel.updateOne(
			{ id: post.id },
			{
				$set: {
					'extendedLikesInfo.myStatus': 'None',
				},
			},
		);
		return result.matchedCount === 1;
	}

	//(11) add None
	async addNone(post: any, userId: string): Promise<boolean> {
		const result = await this.postModel.updateOne(
			{ id: post.id },
			{
				$push: { userAssess: { userIdLike: userId, assess: 'None' } },
			},
		);
		return result.matchedCount === 1;
	}

	//(12) delete all posts
	async deleteAll(): Promise<number> {
		const result = await this.postModel.deleteMany({});
		return result.deletedCount;
	}
}
