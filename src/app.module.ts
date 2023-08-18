import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController, SysAdminController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './entity_user/user.module';
import { BlogModule } from './entity_blog/blog.module';
import { PostModule } from './entity_post/post.module';
import { EmailModule } from './email/email.module';
import { CommentsModule as CommentModule } from './entity_comment/comment.module';
import { TokenModule } from './entity_tokens/tokens.module';
import { BlackListModule } from './entity_black_list/blacklist.module';
import { DevicesModule } from './devices/devices.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MyInterceptor } from './interceptors/logger.interceptor';
import { getConfiguration } from './custom.configuration';

const entityModules = [BlackListModule, BlogModule, CommentModule, PostModule, TokenModule, UserModule];

//root module
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `src/environments/${process.env.NODE_ENV}.env`,
			load: [getConfiguration],
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid('development', 'production', 'testing').default('development'),
				PORT: Joi.number().default(3000).required(),
			}),
		}), //add first
		CqrsModule.forRoot(),
		MongooseModule.forRootAsync({
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get('MONGO_URL'),
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		EmailModule,
		CacheModule.register({ isGlobal: false }),
		DevicesModule,
		ThrottlerModule.forRoot({
			ttl: 10,
			limit: 5,
		}),
		...entityModules,
	],
	controllers: [AppController, SysAdminController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: MyInterceptor,
		},
	],
})
export class AppModule {
	// configure(consumer: MiddlewareConsumer) {
	//   consumer
	//     .apply(PutRequestIntoCacheMiddleware, CheckRequestNumberMiddleware)
	//     .forRoutes('/auth/registration-confirmation', '/auth/registration-email-resending', '/auth/login', '/auth/registration');
	// }
}
