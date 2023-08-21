import { Inject, Injectable } from '@nestjs/common';
import { BlogDTO } from './dto/blogInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { BlogTypeSchema, BlogViewType, BlogViewTypeWithOwner } from '../types/blog';
import { BlogRepository } from './blog.repository';
import { Blog } from './blog.class';
import mongoose from 'mongoose';
import { UserRepository } from '../entity_user/user.repository';
import { RoleType } from '../types/users';

@Injectable()
export class BlogService {
	constructor(
		@Inject(BlogRepository) protected blogRepository: BlogRepository,
		@Inject(UserRepository) protected userRepository: UserRepository,
	) {}

	async findAll(query: QueryDTO, role: RoleType, userName?: string): Promise<BlogTypeSchema> {
		const pageParams = {
			sortBy: query.sortBy || 'createdAt',
			sortDirection: query.sortDirection || 'desc',
			pageNumber: query.pageNumber || 1,
			searchNameTerm: query.searchNameTerm || '',
			pageSize: query.pageSize || 10,
		};

		// define filter
		const filterConditions = [];
		if (pageParams.searchNameTerm) filterConditions.push({ blogName: { $regex: pageParams.searchNameTerm, $options: 'i' } });
		if (userName) filterConditions.push({ owner: userName });
		const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

		// searching blogs
		const blogs = await this.blogRepository.findAll(filter, pageParams.sortBy, pageParams.sortDirection);
		const quantityOfDocs = await this.blogRepository.countAllBlogs(filter);

		//delete property blogOwnerInfo from each blog except for sisAdmin
		const blogsView = (role !== 'sisAdmin') ? 
		blogs.map((blog) => {const { blogOwnerInfo, ...newItem } = blog;
							return newItem})
		: blogs;

		return {
			pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
			page: +pageParams.pageNumber,
			pageSize: +pageParams.pageSize,
			totalCount: quantityOfDocs,
			items: blogsView.slice((+pageParams.pageNumber - 1) * +pageParams.pageSize, +pageParams.pageNumber * +pageParams.pageSize),
		};
	}

	async createBlog(dto: BlogDTO, userName): Promise<BlogViewType | string[]> {
		const blogId = await this.blogRepository.createBlogId();
		let newBlog = new Blog(this.blogRepository); //empty blog
		newBlog = await newBlog.addAsyncParams(dto, userName);
		// put this new blog into db
		try {
			const result = await this.blogRepository.createBlog(newBlog);
			return {
				id: result.id,
				name: result.name,
				description: result.description,
				websiteUrl: result.websiteUrl,
				createdAt: result.createdAt,
				isMembership: result.isMembership,
			};
		} catch (err: any) {
			// throw new Exception()
			const validationErrors = [];
			if (err instanceof mongoose.Error.ValidationError) {
				for (const path in err.errors) {
					const error = err.errors[path].message;
					validationErrors.push(error);
				}
			}
			return validationErrors;
		}
	}

	async getBlogById(blogId: string): Promise<BlogViewType> {
		const result = await this.blogRepository.getBlogById(blogId);
		const { blogOwnerInfo, ...blogView } = result;
		return blogView;
	}

	async updateBlogById(blogId: string, blog: BlogDTO): Promise<number> {
		return await this.blogRepository.updateBlogById(blogId, blog);
	}

	async deleteBlog(blogId: string): Promise<number> {
		return await this.blogRepository.deleteBlogById(blogId);
	}

	async bindBlogWithUser(blogId: string, userId: string) {
		const user = await this.userRepository.findUserById(userId);
		return await this.blogRepository.addOwner(blogId, user.accountData.login, user.id);
	}
}
