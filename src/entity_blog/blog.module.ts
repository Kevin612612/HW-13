import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { BlogController } from './blog.controller';
import { BloggerController } from './blogger.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { CommentsModule } from '../entity_comment/comment.module';
import { PostModule } from '../entity_post/post.module';
import { TokenModule } from '../entity_tokens/tokens.module';
import { UserModule } from '../entity_user/user.module';
import { BlogExistsValidation, BlogHasOwnerValidation } from '../validation/blogValidation';
import { BlackListModule } from '../entity_black_list/blacklist.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		UserModule,
		PostModule,
		CommentsModule,
		TokenModule,
		BlackListModule,
	],
	controllers: [BloggerController, BlogController],
	providers: [BlogService, BlogRepository, BlogExistsValidation, BlogHasOwnerValidation],
	exports: [BlogService, BlogRepository],
})
export class BlogModule {
	// configure(consumer: MiddlewareConsumer) {
	// 	consumer
	// 		.apply(LoggerMiddleware)
	// 		.exclude({ path: 'blogs', method: RequestMethod.POST })
	// 		.forRoutes({ path: 'blogs', method: RequestMethod.GET });
	// }
}
