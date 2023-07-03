import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { BlogExistsValidation } from '../validation/validation';
import { PostService } from '../post/post.service';
import { PostRepository } from '../post/post.repository';
import { Post, PostSchema } from '../post/post.schema';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { CommentRepository } from '../comments/comment.repository';
import { Comment, CommentSchema } from '../comments/comment.schema';
import { CommentsModule } from '../comments/comments.module';
import { PostModule } from '../post/post.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
    ]),
    CommentsModule,
    PostModule
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, BlogExistsValidation],
  exports: [BlogRepository],
})
export class BlogModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'blogs', method: RequestMethod.POST })
      .forRoutes({ path: 'blogs', method: RequestMethod.GET });
  }
}
