import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { BlogDataType, BlogViewType, BlogViewTypeWithOwner } from '../types/blog';
import { BlogDTO } from './dto/blogInputDTO';

@Injectable()
export class BlogRepository {
	
	constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

	async createBlogId() {
		let blogId = 1;
		while (blogId) {
			const blog = await this.blogModel.findOne({ id: blogId.toString() });
			if (!blog) {
				break;
			}
			blogId++;
		}
		return blogId.toString();
	}

	async findAll(filter, sortBy: string, sortDirection: string): Promise<BlogViewTypeWithOwner[]> {
		const order = sortDirection == 'asc' ? 1 : -1;
		return await this.blogModel
			.find(filter)
			.sort({ [sortBy]: order })
			.select({ _id: 0, __v: 0 })
			.lean();
	}

	async countAllBlogs(filter) {
		return await this.blogModel.countDocuments(filter);
	}

	async createBlog(blogObject: any): Promise<BlogDataType> {
		const createdBlog = new this.blogModel(blogObject);
		return await createdBlog.save();
	}

	async getBlogById(blogId: string): Promise<BlogViewTypeWithOwner | undefined> {
		return await this.blogModel.findOne({ id: blogId }).select({ _id: 0, __v: 0 }).lean();
	}

	async updateBlogById(blogId: string, blog: BlogDTO): Promise<number> {
		const result = await this.blogModel.updateOne(
			{ id: blogId },
			{
				$set: {
					name: blog.name,
					description: blog.description,
					websiteUrl: blog.websiteUrl,
				},
			},
		);
		return result.modifiedCount;
	}

	async deleteBlogById(blogId: string): Promise<number> {
		const result = await this.blogModel.deleteOne({ id: blogId });
		return result.deletedCount;
	}

	async deleteAll(): Promise<number> {
		const result = await this.blogModel.deleteMany({});
		return result.deletedCount;
	}

	async addOwner(blogId: string, userLogin: string, userId: string): Promise<number> {
		const result = await this.blogModel.updateOne(
			{ id: blogId },
			{
				$set: {
					'blogOwnerInfo.userId' : userId,
					'blogOwnerInfo.userLogin' : userLogin,
				},
			},
		);
		return result.modifiedCount;
	}
}
