import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { BlogViewType } from '../types/blog';
import { BlogDTO } from '../dto/blog.dto';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlogId() {
    let blogId = 1;
    while (blogId) {
      let blog = await this.blogModel.findOne({ id: blogId.toString() });
      if (!blog) {
        break;
      }
      blogId++;
    }
    return blogId.toString();
  }

  async findAll(sortBy: string, sortDirection: string, searchNameTerm: string): Promise<BlogViewType[]> {
    const order = sortDirection == 'asc' ? 1 : -1;
    const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};
    return await this.blogModel
      .find(filter)
      .sort({ [sortBy]: order })
      .select({ _id: 0, __v: 0 })
      .exec();
  }

  async countAllBlogs(searchNameTerm: string) {
    const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};
    return await this.blogModel.countDocuments(filter);
  }

  async createBlog(blogObject: any): Promise<any> {
    const createdBlog = new this.blogModel(blogObject);
    return await createdBlog.save();
  }

  async getBlogById(blogId: string): Promise<any> {
    return await this.blogModel.findOne({ id: blogId }).select({ _id: 0, __v: 0 }).exec();
  }

  async updateBlogById(blogId: string, blog: BlogDTO): Promise<any> {
    const result = await this.blogModel.updateOne(
      { id: blogId },
      {
        $set: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
        },
      },
    );
    return result.modifiedCount;
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
