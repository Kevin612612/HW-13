import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/users.repository';
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
    const order = pageParams.sortDirection === 'asc' ? 1 : -1;
    const blogs = await this.blogRepository.findAll(pageParams.sortBy, pageParams.sortDirection);
    const quantityOfDocs = await this.blogRepository.countAllBlogs({});

    return {
      pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
      page: +pageParams.pageNumber,
      pageSize: +pageParams.pageSize,
      totalCount: quantityOfDocs,
      items: blogs
        .slice(
          (+pageParams.pageNumber - 1) * +pageParams.pageSize,
          +pageParams.pageNumber * +pageParams.pageSize,
        ),
    };
  }

  //   async createBlog(dto: BlogDTO): Promise<BlogViewType> {
  //     const blogObject = {
  //       _id: new ObjectId(),
  //       id: '1010',
  //       login: dto.login,
  //       password: dto.password,
  //       email: dto.email,
  //       createdAt: new Date(),
  //     };
  //     const createdUser = await this.blogRepository.createBlog(blogObject);
  //     const { _id, password, __v, ...blogWithoutPassword } =
  //       createdUser.toObject();
  //     return blogWithoutPassword;
  //   }

  async deleteBlog(blogId: string): Promise<any> {
    const result = await this.blogRepository.deleteBlogById(blogId); // 0 || 1
    return result
      ? { status: 204, error: 'Blog was deleted' }
      : { status: 404, error: 'Blog not found' };
  }
}
