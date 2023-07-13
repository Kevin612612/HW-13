import { ObjectId } from 'mongodb';
import { Inject } from '@nestjs/common';
import { BlogDTO } from './dto/blogInputDTO';
import { BlogRepository } from './blog.repository';

export class Blog {
  public _id: ObjectId;
  public createdAt: string;
  public isMembership: boolean;

  constructor(
    @Inject(BlogRepository) private blogRepository: BlogRepository,
    public id: string = 'no id',
    public name: string = 'no name',
    public description: string = 'no description',
    public websiteUrl: string = 'no url',
    public __v: number = 0,
  ) {
    this._id = new ObjectId();
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
    this.__v = 0;
  }

  public async addAsyncParams(dto: BlogDTO) {
    const blogId = await this.blogRepository.createBlogId();
    return new Blog(this.blogRepository, blogId, dto.name, dto.description, dto.websiteUrl);
  }
}
