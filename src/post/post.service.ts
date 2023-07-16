import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from '../blog/blog.repository';
import { PostRepository } from './post.repository';
import { PostDTO } from '../post/dto/postInputDTO';
import { QueryDTO } from '../dto/query.dto';
import { PostsTypeSchema, PostViewType } from '../types/post';
import { Post } from './post.class';
import mongoose from 'mongoose';
import { UserDataType } from '../types/users';
import { CommentRepository } from '../comments/comment.repository';

//(1) changeLikeStatus

//(4) findAll
//(5) createPost
//(6) findPostById
//(7) updatePostById
//(8) deletePost

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) protected postRepository: PostRepository,
    @Inject(BlogRepository) protected blogRepository: BlogRepository,
    @Inject(CommentRepository) protected commentRepository: CommentRepository,
  ) {}

  //(1) method changes like status
  async changeLikeStatus(postId: string, likeStatus: string, user: UserDataType): Promise<boolean> {
    //find post
    const post = await this.postRepository.findPostByIdDbType(postId);
    //change myStatus / myStatus = current assess
    const result = await this.postRepository.changeLikeStatus(postId, likeStatus);
    //check whether this user left assess to this post
    const userAssess = post.userAssess.find(obj => obj.userIdLike === user.id);
    //if this user didn't leave like/dislike -> add like/dislike/none to post
    if (!userAssess) {
      if (likeStatus == 'Like') {
        const result1 = await this.postRepository.addLike(post, user);
      }
      if (likeStatus == 'Dislike') {
        const result2 = await this.postRepository.addDislike(post, user.id);
      }
      if (likeStatus == 'None') {
        const result3 = await this.postRepository.setNone(post);
      }
    } else {
      //assess of this user
      const assess = userAssess.assess;
      if (assess == 'Like' && likeStatus == 'Like') {
        //nothing
      }
      if (assess == 'Like' && likeStatus == 'Dislike') {
        //minus like and delete user from array then add addDislike()
        const result1 = await this.postRepository.deleteLike(post, user.id);
        const result2 = await this.postRepository.addDislike(post, user.id);
        //set my status None
        const result3 = await this.postRepository.setNone(post);
      }
      if (assess == 'Like' && likeStatus == 'None') {
        //minus like and delete user from array
        const result1 = await this.postRepository.deleteLike(post, user.id);
      }
      if (assess == 'Dislike' && likeStatus == 'Like') {
        //minus dislike and delete user from array then add addLike()
        const result1 = await this.postRepository.deleteDislike(post, user.id);
        const result2 = await this.postRepository.addLike(post, user);
        //set my status None
        const result3 = await this.postRepository.setNone(post);
      }
      if (assess == 'Dislike' && likeStatus == 'Dislike') {
        //nothing
      }
      if (assess == 'Dislike' && likeStatus == 'None') {
        //minus dislike and delete user from array
        const result1 = await this.postRepository.deleteDislike(post, user.id);
      }
    }
    return true;
  }

  //(4) this method return all posts || all posts by blogId || all posts by name || all posts by blogId and name
  async findAll(query: QueryDTO, userId: string, blogId?: string): Promise<PostsTypeSchema> {
    const pageParams = {
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      pageNumber: query.pageNumber || 1,
      searchNameTerm: query.searchNameTerm || '',
      pageSize: query.pageSize || 10,
    };
    const allDataPosts = await this.postRepository.findAll(
      pageParams.searchNameTerm,
      pageParams.sortBy,
      pageParams.sortDirection,
      blogId,
    );
    const quantityOfDocs = await this.postRepository.countAllPosts(blogId, pageParams.searchNameTerm);

    //filter allDataPosts and return array that depends on which user send GET-request
    const sortedItems = allDataPosts.map(post => {
      if (post.userAssess.find(el => el.userIdLike === userId)) {
        //if current user exist in userAsses array
        return {
          extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: post.userAssess.find(el => el.userIdLike === userId)?.assess || 'None',
            newestLikes: post.extendedLikesInfo.newestLikes
              .slice(-3)
              .map(obj => {
                return {
                  addedAt: obj.addedAt,
                  login: obj.login,
                  userId: obj.userId,
                };
              })
              .reverse(),
          },
          id: post.id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
        };
      } else {
        return {
          extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: 'None',
            newestLikes: post.extendedLikesInfo.newestLikes
              .slice(-3)
              .map(obj => {
                return {
                  addedAt: obj.addedAt,
                  login: obj.login,
                  userId: obj.userId,
                };
              })
              .reverse(),
          },
          id: post.id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
        };
      }
    });

    return {
      pagesCount: Math.ceil(quantityOfDocs / +pageParams.pageSize),
      page: +pageParams.pageNumber,
      pageSize: +pageParams.pageSize,
      totalCount: quantityOfDocs,
      items: sortedItems.slice(
        (+pageParams.pageNumber - 1) * +pageParams.pageSize,
        +pageParams.pageNumber * +pageParams.pageSize,
      ),
    };
  }

  //(5) method creates post with specific blogId
  async createPost(dto: PostDTO): Promise<PostViewType | string[]> {
    let newPost = new Post(this.postRepository, this.blogRepository); //empty post
    newPost = await newPost.addAsyncParams(dto); // fill post with async params
    // put this new post into db
    try {
      const createdPost = await this.postRepository.createPost(newPost);
      return {
        id: createdPost.id,
        title: createdPost.title,
        shortDescription: createdPost.shortDescription,
        content: createdPost.content,
        blogId: createdPost.blogId,
        blogName: createdPost.blogName,
        createdAt: createdPost.createdAt,
        extendedLikesInfo: createdPost.extendedLikesInfo,
      };
    } catch (err: any) {
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

  //(6) method returns post by ID
  async findPostById(postId: string, user: any): Promise<PostViewType | number> {
    //find post
    const post = await this.postRepository.findPostByIdDbType(postId);
    //hide info about likes from unauthorized user
    if (user == null) {
      post.extendedLikesInfo.myStatus = 'None';
    }
    //if user authorized
    if (user != null) {
      //if user authorized -> find his like/dislike in userAssess Array in post
      const assess = post.userAssess.find(obj => obj.userIdLike === user.id)?.assess;
      //return post to user with his assess if this user left like or dislike
      if (assess) {
        post.extendedLikesInfo.myStatus = assess; //like or dislike
      } else {
        post.extendedLikesInfo.myStatus = 'None';
      }
    }

    //return viewModel converted from dataModel into view with 3 last assess
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: post.extendedLikesInfo.myStatus,
        newestLikes: post.extendedLikesInfo.newestLikes
          .slice(-3)
          .sort((a, b) => b.login.localeCompare(a.login))
          .map(obj => {
            return {
              addedAt: obj.addedAt,
              login: obj.login,
              userId: obj.userId,
            };
          }),
      },
    };
  }

  //(7) method updates post by postId
  async updatePostById(postId: string, dto: PostDTO): Promise<boolean | number | string[]> {
    const foundBlog = await this.blogRepository.getBlogById(dto.blogId);
    try {
      const result = this.postRepository.updatePostById(postId, dto);
      return true;
    } catch (err: any) {
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

  //(8) method deletes post by postId
  async deletePost(postId: string): Promise<number> {
    return await this.postRepository.deletePostById(postId);
  }
}
