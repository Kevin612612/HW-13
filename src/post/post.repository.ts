import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { PostDTO } from '../post/dto/postInputDTO';
import { PostViewType } from '../types/post';

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

  async findAll(
    blogId: string,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
  ): Promise<PostViewType[]> {
    const filter = blogId
      ? searchNameTerm
        ? { $and: [{ blogId: blogId }, { title: { $regex: searchNameTerm, $options: 'i' } }] }
        : { blogId: blogId }
      : {};
    const order = sortDirection == 'asc' ? 1 : -1;
    return await this.postModel
      .find(filter)
      .sort({ [sortBy]: order })
      .select({ _id: 0, __v: 0, 'extendedLikesInfo._id': 0, userAssess: 0 })
      .exec();
  }

  async countAllPosts(blogId: string, searchNameTerm: any) {
    const filter = blogId
      ? searchNameTerm
        ? { $and: [{ blogId: blogId }, { title: { $regex: searchNameTerm, $options: 'i' } }] }
        : { blogId: blogId }
      : {};
    return await this.postModel.countDocuments(filter);
  }

  async createPost(postObject: any): Promise<any> {
    const createdPost = new this.postModel(postObject);
    return await createdPost.save();
  }

  async getPostById(postId: string): Promise<any> {
    return await this.postModel
      .findOne({ id: postId })
      .select({ _id: 0, __v: 0, userAssess: 0, 'extendedLikesInfo._id': 0 })
      .exec();
  }

  async updatePostById(postId: string, post: PostDTO): Promise<number> {
    const result = await this.postModel.updateOne(
      { id: postId },
      {
        $set: {
          content: post.content,
          shortDescription: post.shortDescription,
          title: post.title,
          blogId: post.blogId,
        },
      },
    );
    return result.modifiedCount;
  }

  async deletePostById(postId: string): Promise<number> {
    const result = await this.postModel.deleteOne({ id: postId });
    return result.deletedCount;
  }

  async deleteAll(): Promise<number> {
    const result = await this.postModel.deleteMany({});
    return result.deletedCount;
  }
}
