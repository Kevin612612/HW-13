import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuardBasic } from './guards/authBasic.guard';
import { BlogService } from './entity_blog/blog.service';
import { UsersService } from './entity_user/user.service';
import { QueryDTO, QueryUserDTO } from './dto/query.dto';
import { UserTypeSchema, UserViewType } from './types/users';
import { LogClassName } from './decorators/logger.decorator';
import { BlogIdDTO, BlogIdDTO_1, UserIdDTO } from './dto/id.dto';
import { BanDTO, UserDTO } from './entity_user/dto/userInputDTO';
import { BlogTypeSchema } from './types/blog';
import { BlogBanDTO } from './entity_blog/dto/blogInputDTO';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@UseGuards(AuthGuardBasic)
@Controller('sa')
export class SysAdminController {
	constructor(@Inject(BlogService) protected blogService: BlogService, @Inject(UsersService) protected usersService: UsersService) {}

	// ############################---BLOGS---############################

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('blogs/:blogId/ban')
	@LogClassName()
	async banBlog(@Param() blogId: BlogIdDTO_1, @Body() banDTO: BlogBanDTO) {
		return await this.blogService.banBlog(blogId.blogId, banDTO);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('blogs/:blogId/bind-with-user/:userId')
	@LogClassName()
	async bindBlogWithUser(@Param() blogId: BlogIdDTO, @Param() userId: UserIdDTO) {
		return await this.blogService.bindBlogWithUser(blogId.blogId, userId.userId);
	}

	@Get('blogs')
	@LogClassName()
	async getAllBlogs(@Query() query: QueryDTO): Promise<BlogTypeSchema> {
		return await this.blogService.findAll(query, 'sisAdmin', null);
	}

	// ############################---USERS---############################

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('users/:userId/ban')
	@LogClassName()
	async banUser(@Param() userId: UserIdDTO, @Body() banDTO: BanDTO) {
		return await this.usersService.banUser(userId.userId, banDTO);
	}

	@Get('users')
	@LogClassName()
	async getAll(@Query() query: QueryUserDTO): Promise<UserTypeSchema> {
		return await this.usersService.findAll(query);
	}

	@Post('users')
	@LogClassName()
	async createUser(@Body() dto: UserDTO): Promise<UserViewType | string[]> {
		return await this.usersService.createUser(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/users/:userId')
	@LogClassName()
	async deleteUserById(@Param() params: UserIdDTO): Promise<any> {
		return await this.usersService.deleteUserById(params.userId);
	}
}
