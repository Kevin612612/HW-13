import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from '../user/dto/userInputDTO';
import { UserTypeSchema, UserViewType } from '../types/users';
import { UsersService } from './users.service';
import { QueryUserDTO } from '../dto/query.dto';
import { UserIdDTO } from '../dto/id.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) protected userService: UsersService) {}

  @Get()
  async getAll(@Query() query: QueryUserDTO): Promise<UserTypeSchema> {
    return await this.userService.findAll(query);
  }

  @Post()
  async createUser(@Body() dto: UserDTO): Promise<UserViewType | string[]> {
    return await this.userService.createUser(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:userId')
  async deleteUserById(@Param() params: UserIdDTO): Promise<any> {
    return await this.userService.deleteUserById(params.userId);
  }
}
