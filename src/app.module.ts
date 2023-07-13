import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { PostModule } from './post/post.module';
import { EmailModule } from './email/email.module';
import { CommentsModule } from './comments/comments.module';
import { TokenModule } from './tokens/tokens.module';
import { BlackListModule } from './black list/blacklist.module';
import { CheckAccessTokenMiddleware } from './middleware/extractUser.middleware';
import { PostController } from './post/post.controller';

//root module
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    UserModule,
    BlogModule,
    PostModule,
    EmailModule,
    CommentsModule,
    TokenModule,
    BlackListModule,
    CacheModule.register({ isGlobal: false }),
  ],
  controllers: [AppController],
  providers: [AppService],
})  
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CheckAccessTokenMiddleware)
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
