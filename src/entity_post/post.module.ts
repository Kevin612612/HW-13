import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { BlogRepository } from '../entity_blog/blog.repository';
import { Blog, BlogSchema } from '../entity_blog/blog.schema';
import { Post, PostSchema } from './post.schema';
import { TokenModule } from '../entity_tokens/tokens.module';
import { UserModule } from '../entity_user/user.module';
import { BlackListModule } from '../entity_black_list/blacklist.module';
import { CommentsModule } from '../entity_comment/comment.module';
import { PostExistsValidation } from '../validation/postValidation';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
    TokenModule,
    UserModule,
    BlackListModule,
    CommentsModule
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostExistsValidation, BlogRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
