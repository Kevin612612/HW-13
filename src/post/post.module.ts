import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { BlogRepository } from '../blog/blog.repository';
import { PostExistsValidation } from '../validation/validation';
import { Blog, BlogSchema } from '../blog/blog.schema';
import { Post, PostSchema } from './post.schema';
import { Comment, CommentSchema } from '../comments/comment.schema';
import { CommentRepository } from '../comments/comment.repository';


@Module({
  imports: [MongooseModule.forFeature([
    { name: Blog.name, schema: BlogSchema },
    { name: Post.name, schema: PostSchema },
    { name: Comment.name, schema: CommentSchema },
  ])],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostExistsValidation, BlogRepository, CommentRepository],
  exports: [PostRepository],
})
export class PostModule {}
