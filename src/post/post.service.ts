import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogRepository } from '../blog/blog.repository';
import { PostDTO } from '../dto/post.dto';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema, PostViewType } from '../types/post';
import { PostRepository } from './post.repository';


@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) protected postRepository: PostRepository,
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
  ) {}

  async findAll(blogId: string, query: QueryDTO): Promise<PostsTypeSchema> {
    const pageParams = {
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      pageNumber: query.pageNumber || 1,
      searchNameTerm: query.searchNameTerm || '',
      pageSize: query.pageSize || 10,
    };
    const posts = await this.postRepository.findAll(blogId, pageParams.searchNameTerm, pageParams.sortBy, pageParams.sortDirection);
    const quantityOfDocs = await this.postRepository.countAllPosts(blogId, pageParams.searchNameTerm);
    return {
      pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
      page: +pageParams.pageNumber,
      pageSize: +pageParams.pageSize,
      totalCount: quantityOfDocs,
      items: posts.slice(
        (+pageParams.pageNumber - 1) * +pageParams.pageSize,
        +pageParams.pageNumber * +pageParams.pageSize,
      ),
    };
  }

  async createPost(blogId: string, dto: PostDTO): Promise<PostViewType> {
    const postId = await this.postRepository.createPostId();
    const idOfBlog = blogId ? blogId : dto.blogId
    const blog = await this.blogRepository.getBlogById(idOfBlog);
    const postObject = {
      _id: new ObjectId(),
      id: postId,
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: (new Date()).toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
      userAssess: [],
    };
    const createdPost = await this.postRepository.createPost(postObject);
    const { _id, userAssess, ...postWithout_id } = postObject;
    return postWithout_id;
  }

  async getPostById(postId: string): Promise<any> {
    return await this.postRepository.getPostById(postId);
  }

  async updatePostById(postId: string, post: PostDTO): Promise<number> {
    return await this.postRepository.updatePostById(postId, post);
  }

  async deletePost(postId: string): Promise<number> {
    return await this.postRepository.deletePostById(postId);
  }
}
