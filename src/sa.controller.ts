import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { AuthGuardBasic } from "./guards/authBasic.guard";
import { BlogService } from "./entity_blog/blog.service";
import { UsersService } from "./entity_user/user.service";
import { QueryDTO, QueryUserDTO } from "./dto/query.dto";
import { UserTypeSchema, UserViewType } from "./types/users";
import { LogFunctionName } from "./decorators/logger.decorator";
import { BlogIdDTO, UserIdDTO } from "./dto/id.dto";
import { BanDTO, UserDTO } from "./entity_user/dto/userInputDTO";
import { BlogTypeSchema } from "./types/blog";

@SkipThrottle()
@UseGuards(AuthGuardBasic)
@Controller('sa')
export class SysAdminController {
  constructor(
    @Inject(BlogService) protected blogService: BlogService,
    @Inject(UsersService) protected usersService: UsersService,
  ) {}

  @Get('blogs')
  @LogFunctionName()
	async getAllBlogs(@Query() query: QueryDTO): Promise<BlogTypeSchema> {
		return await this.blogService.findAll(query, null);
	}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('blogs/:blogId/bind-with-user/:userId')
  @LogFunctionName()
	async bindBlogWithUser(@Param() blogId: BlogIdDTO, @Param() userId: UserIdDTO) {
		return await this.blogService.bindBlogWithUser(blogId.blogId, userId.userId);
	}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('users/:userId/ban')
	@LogFunctionName()
	async banUser(@Param() userId: UserIdDTO, @Body() banDTO: BanDTO) {
		return await this.usersService.banUser(userId.userId, banDTO);
	}

  @Get('users')
	@LogFunctionName()
	async getAll(@Query() query: QueryUserDTO): Promise<UserTypeSchema> {
		return await this.usersService.findAll(query);
	}

	@Post('users')
	@LogFunctionName()
	async createUser(@Body() dto: UserDTO): Promise<UserViewType | string[]> {
		return await this.usersService.createUser(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/users/:userId')
	@LogFunctionName()
	async deleteUserById(@Param() params: UserIdDTO): Promise<any> {
		return await this.usersService.deleteUserById(params.userId);
	}
}