import { Module } from '@nestjs/common';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { CommentRepository } from './comment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { PostRepository } from '../post/post.repository';
import { BlogRepository } from '../blog/blog.repository';
import { Blog, BlogSchema } from '../blog/blog.schema';
import { Post, PostSchema } from '../post/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ])
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PostRepository, BlogRepository],
  exports: [CommentService, CommentRepository],
})
export class CommentsModule {}
