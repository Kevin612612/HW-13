import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { UsersController } from './user/users.controller';
import { AppService } from './app.service';
import { UsersService } from './user/users.service';
import { User, UserSchema } from './user/users.schema';
import { UserRepository } from './user/users.repository';
import { BlogController } from './blog/blog.controller';
import { BlogRepository } from './blog/blog.repository';
import { BlogService } from './blog/blog.service';
import { Blog, BlogSchema } from './blog/blog.schema';
import { PostRepository } from './post/post.repository';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { Post, PostSchema } from './post/post.schema';
import { BlogExistsValidation } from './validation/validation';

//root module
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [AppController, UsersController, BlogController, PostController],
  providers: [
    AppService,
    UsersService,
    UserRepository,
    BlogService,
    BlogRepository,
    PostService,
    PostRepository,
    BlogExistsValidation,
  ],
})
export class AppModule {
  //empty class
}
