import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPostId() {
    let postId = 1;
    while (postId) {
      let post = await this.postModel.findOne({ id: postId.toString() });
      if (!post) {
        break;
      }
      postId++;
    }
    return postId.toString();
  }

  async findAll(blogId: string, sortBy: string, sortDirection: string): Promise<any[]> {
    const filter = blogId ? { blogId: blogId } : {};
    const order = sortDirection == 'asc' ? 1 : -1;
    return await this.postModel
      .find(filter)
      .sort({ [sortBy]: order })
      .select({ _id: 0, __v: 0, 'extendedLikesInfo._id': 0, userAssess: 0 })
      .exec();
  }

  async countAllPosts(filter: any) {
    return await this.postModel.countDocuments(filter);
  }

  async createPost(postObject: any): Promise<any> {
    const createdPost = new this.postModel(postObject);
    return await createdPost.save();
  }

  async getPostById(postId: string): Promise<any> {
    return this.postModel
      .findOne({ id: postId })
      .select({ _id: 0, __v: 0, userAssess: 0, 'extendedLikesInfo._id': 0 })
      .exec();
  }

  async updatePostById(postId: string): Promise<number> {
    const result = await this.postModel.updateOne({ id: postId });
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
