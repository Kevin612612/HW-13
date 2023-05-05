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

//root module
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [AppController, UsersController, BlogController],
  providers: [
    AppService,
    UsersService,
    UserRepository,
    BlogService,
    BlogRepository,
  ],
})
export class AppModule {
  //empty class
}
