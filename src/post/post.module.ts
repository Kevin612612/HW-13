import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { BlogRepository } from '../blog/blog.repository';
import { Blog, BlogSchema } from '../blog/blog.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }, { name: Post.name, schema: PostSchema }])],
  controllers: [PostController],
  providers: [PostService, PostRepository, BlogRepository],
  exports: [PostRepository],
})
export class PostModule {}
