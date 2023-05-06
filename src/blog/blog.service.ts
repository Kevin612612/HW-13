import { Inject, Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { BlogTypeSchema, BlogViewType } from 'src/types/blog';
import { ObjectId } from 'mongodb';
import { BlogDTO } from 'src/dto/blog.dto';
import { QueryDTO } from 'src/dto/query.dto';

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
    );
    const quantityOfDocs = await this.blogRepository.countAllBlogs({});

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
      createdAt: new Date(),
      isMembership: true,
    };
    const createdBlog = await this.blogRepository.createBlog(blogObject);
    const { _id, __v, ...blogWithout_id } = createdBlog.toObject();
    return blogWithout_id;
  }

  async getBlogById(blogId: string): Promise<any> {
    return await this.blogRepository.getBlogById(blogId);
  }

  async updateBlogById(blogId: string): Promise<any> {
    const result = await this.blogRepository.updateBlogById(blogId);
    return result
      ? { status: 204, error: 'Blog was updated' }
      : { status: 404, error: 'Blog not found' };
  }

  async deleteBlog(blogId: string): Promise<any> {
    const result = await this.blogRepository.deleteBlogById(blogId);
    return result
      ? { status: 204, error: 'Blog was deleted' }
      : { status: 404, error: 'Blog not found' };
  }
}
