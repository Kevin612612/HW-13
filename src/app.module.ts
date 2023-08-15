import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const entityModules = [BlackListModule, BlogModule, CommentModule, PostModule, TokenModule, UserModule];

//root module
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/environments/development.env' }), //add first
		//ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/environments/deployment.env' }),
		//ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/environments/test.env' }),
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
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
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
