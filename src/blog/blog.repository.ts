import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';
import { BlogDataType, BlogViewType } from 'src/types/blog';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findAll(sortBy: string, sortDirection: string): Promise<BlogViewType[]> {
    const order = (sortDirection == 'asc') ? 1 : -1;
    return this.blogModel.find().sort({[sortBy]: order}).select({_id: 0, __v: 0}).exec();
  }

  async countAllBlogs(filter: any) {
    return await this.blogModel.countDocuments(filter);
  }

  async createBlog(blogObject: any): Promise<any> {
    const createdBlog = new this.blogModel(blogObject);
    return await createdBlog.save();
  }

  async getBlogById(blogId: string): Promise<any> {
    return this.blogModel.find({id: blogId}).select({_id: 0, __v: 0}).exec();
  }

  async updateBlogById(blogId: string): Promise<number> {
    const result =  await this.blogModel.updateOne({id: blogId})
    return result.modifiedCount
  }

  async deleteBlogById(blogId: string): Promise<number> {
    const result = await this.blogModel.deleteOne({ id: blogId });
    return result.deletedCount;
  }

  async deleteAll(): Promise<number> {
    const result = await this.blogModel.deleteMany({});
    return result.deletedCount;
  }
}
