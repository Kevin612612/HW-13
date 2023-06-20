import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserDTO } from '../user/dto/userInputDTO';
import { UserTypeSchema } from '../types/users';
import { UsersService } from './users.service';
import { QueryUserDTO } from '../dto/query.dto';
import { UserIdDTO } from '../dto/id.dto';
import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) protected userService: UsersService) {}

  @Get()
  async getAll(@Query() query: QueryUserDTO): Promise<UserTypeSchema> {
    const result =  await this.userService.findAll(query);
    return result;
  }

  @Post()
  async createUser(@Body() dto: UserDTO) {
    const result =  await this.userService.createUser(dto);
    return result;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:userId')
  async deleteUserById(@Param() params: UserIdDTO) {
    const result = await this.userService.deleteUserById(params.userId);
    return result;
  }
}
