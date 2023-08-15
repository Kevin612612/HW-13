import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserDTO } from './dto/userInputDTO';
import { UserTypeSchema, UserViewType } from '../types/users';
import { UsersService } from './user.service';
import { QueryUserDTO } from '../dto/query.dto';
import { UserIdDTO } from '../dto/id.dto';
import { AuthGuardBasic } from '../guards/authBasic.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { LogFunctionName } from '../decorators/logger.decorator';

@SkipThrottle()
@UseGuards(AuthGuardBasic)
@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController');
	constructor(@Inject(UsersService) protected userService: UsersService) {}

	@Get()
	async getAll(@Query() query: QueryUserDTO): Promise<UserTypeSchema> {
		return await this.userService.findAll(query);
	}

	@Post()
  @LogFunctionName()
	async createUser(@Body() dto: UserDTO): Promise<UserViewType | string[]> {
    //this.logger.log(getFunctionName() + ' starts performing')
		return await this.userService.createUser(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:userId')
	async deleteUserById(@Param() params: UserIdDTO): Promise<any> {
		return await this.userService.deleteUserById(params.userId);
	}
}
