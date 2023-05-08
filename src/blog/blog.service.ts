import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogDTO } from '../dto/blog.dto';
import { QueryDTO } from '../dto/query.dto';
import { BlogTypeSchema, BlogViewType } from '../types/blog';
import { BlogRepository } from './blog.repository';


@Injectable()
export class BlogService {
  constructor(
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
  ) {}

  async findAll(query: QueryDTO): Promise<BlogTypeSchema> {
    const pageParams = {
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      pageNumber: query.pageNumber || 1,
      searchNameTerm: query.searchNameTerm || '',
      pageSize: query.pageSize || 10,
    };
    const blogs = await this.blogRepository.findAll(
      pageParams.sortBy,
      pageParams.sortDirection,
      pageParams.searchNameTerm
    );
    const quantityOfDocs = await this.blogRepository.countAllBlogs(pageParams.searchNameTerm);

    return {
      pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
      page: +pageParams.pageNumber,
      pageSize: +pageParams.pageSize,
      totalCount: quantityOfDocs,
      items: blogs.slice(
        (+pageParams.pageNumber - 1) * +pageParams.pageSize,
        +pageParams.pageNumber * +pageParams.pageSize,
      ),
    };
  }

  async createBlog(dto: BlogDTO): Promise<BlogViewType> {
    const blogId = await this.blogRepository.createBlogId()
    const blogObject = {
      _id: new ObjectId(),
      id: blogId,
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: (new Date()).toISOString(),
      isMembership: false,
    };
    const createdBlog = await this.blogRepository.createBlog(blogObject);
    const { _id, __v, ...blogWithout_id } = createdBlog.toObject();
    return blogWithout_id;
  }

  async getBlogById(blogId: string): Promise<any> {
    return await this.blogRepository.getBlogById(blogId);
  }

  async updateBlogById(blogId: string, blog: BlogDTO): Promise<number> {
    return await this.blogRepository.updateBlogById(blogId, blog);
  }

  async deleteBlog(blogId: string): Promise<number> {
    return await this.blogRepository.deleteBlogById(blogId);
  }
}
