import { Controller } from '@nestjs/common';

@Controller('comments')
export class CommentController {
//   constructor(
//     @Inject(PostService) protected postService: PostService,
//     @Inject(BlogRepository) protected blogRepository: BlogRepository,
//   ) {}

//   @Get()
//   async getAllPosts(@Query() query: QueryDTO): Promise<PostsTypeSchema> {
//     return await this.postService.findAll(null, query);
//   }

//   @Post()
//   async createPost(@Body() dto: PostDTO, @Res() res: Response) {
//     const blog = await this.blogRepository.getBlogById(dto.blogId);
//     if (!blog) res.sendStatus(404);
//     const result = await this.postService.createPost(dto.blogId, dto);
//     res.send(result);
//   }

//   @Get('/:postId')
//   async getPostById(@Param() params: PostIdDTO, @Res() res: Response) {
//     const post = await this.postService.getPostById(params.postId);
//     if (!post) {
//       res.sendStatus(404);
//     } else {
//       res.send(post);
//     }
//   }

//   @Put('/:postId')
//   async updatePostById(@Param() params: PostIdDTO, @Body() post: PostDTO, @Res() res: Response) {
//     const result = await this.postService.updatePostById(params.postId, post);
//     if (!result) {
//       res.sendStatus(404);
//     } else {
//       res.sendStatus(204);
//     }
//   }

//   @Delete('/:postId')
//   async deletePost(@Param() params: PostIdDTO, @Res() res: Response) {
//     const result = await this.postService.deletePost(params.postId);
//     if (!result) {
//       res.sendStatus(404);
//     } else {
//       res.sendStatus(204);
//     }
//   }
}
