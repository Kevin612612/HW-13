import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { BlogBanDTO, BlogDTO } from './dto/blogInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { BlogTypeSchema, BlogViewType } from '../types/blog';
import { BlogRepository } from './blog.repository';
import { Blog } from './blog.class';
import mongoose from 'mongoose';
import { UserRepository } from '../entity_user/user.repository';
import { RoleType } from '../types/users';
import { paging } from '../secondary functions/paging';

@Injectable()
export class BlogService {
	constructor(
		@Inject(BlogRepository) protected blogRepository: BlogRepository,
		@Inject(UserRepository) protected userRepository: UserRepository,
	) {}

	async findAll(query: QueryDTO, role: RoleType, userLogin?: string): Promise<BlogTypeSchema> {
		const pageParams = {
			sortBy: query.sortBy || 'createdAt',
			sortDirection: query.sortDirection || 'desc',
			pageNumber: +query.pageNumber || 1,
			searchNameTerm: query.searchNameTerm || '',
			pageSize: +query.pageSize || 10,
		};

		// define filter
		const filterConditions = [];
		if (pageParams.searchNameTerm) filterConditions.push({ name: { $regex: pageParams.searchNameTerm, $options: 'i' } });
		if (userLogin) filterConditions.push({ 'blogOwnerInfo.userLogin': userLogin });
		const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

		// searching blogs
		const blogs = await this.blogRepository.findAll(filter, pageParams.sortBy, pageParams.sortDirection);
		const quantityOfDocs = await this.blogRepository.countAllBlogs(filter);

		//delete property blogOwnerInfo from each blog except for sisAdmin
		const blogsView = (role !== 'sisAdmin') ? 
		blogs.map((blog) => {const { blogOwnerInfo, banInfo, ...newItem } = blog;
							return newItem})
		: blogs;

		return paging(pageParams, blogsView, quantityOfDocs);
	}

	async createBlog(dto: BlogDTO, blogOwnerInfo): Promise<BlogViewType | string[]> {
		let newBlog = new Blog(this.blogRepository); //empty blog
		newBlog = await newBlog.addAsyncParams(dto, blogOwnerInfo);
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

	async updateBlogById(blogId: string, userId: string, blog: BlogDTO): Promise<number> {
		const foundedBlog = await this.blogRepository.getBlogById(blogId);
		if (foundedBlog.blogOwnerInfo.userId !== userId) throw new ForbiddenException(["it's not your blog"]);
		return await this.blogRepository.updateBlogById(blogId, blog);
	}

	async deleteBlog(blogId: string, userId: string): Promise<number> {
		const foundedBlog = await this.blogRepository.getBlogById(blogId);
		if (foundedBlog.blogOwnerInfo.userId !== userId) throw new ForbiddenException(["it's not your blog"]);
		return await this.blogRepository.deleteBlogById(blogId);
	}

	async bindBlogWithUser(blogId: string, userId: string) {
		const user = await this.userRepository.findUserById(userId);
		return await this.blogRepository.addOwner(blogId, user.accountData.login, user.id);
	}

	async banBlog(blogId: string, banDTO: BlogBanDTO) {
		if (banDTO.isBanned === true) {
			return await this.blogRepository.banBlog(blogId);
		} else {
			return await this.blogRepository.unbanBlog(blogId);
		}
	}
}
