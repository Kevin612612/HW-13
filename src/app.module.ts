import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { DevicesModule } from './devices/devices.module';
import { PutRequestIntoCacheMiddleware } from './middleware/putRequestIntoCache.middleware';
import { CheckRequestNumberMiddleware } from './middleware/checkRequestNumber.middleware';


//root module
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    UserModule,
    BlogModule,
    PostModule,
    CommentsModule,
    EmailModule,
    TokenModule,
    BlackListModule,
    CacheModule.register({ isGlobal: false }),
    DevicesModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(PutRequestIntoCacheMiddleware, CheckRequestNumberMiddleware)
  //     .forRoutes('/auth/registration-confirmation', '/auth/registration-email-resending', '/auth/login', '/auth/registration');
  // }
}



