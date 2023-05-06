import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from 'src/dto/user.dto';
import { UserTypeSchema } from 'src/types/users';

@Controller('users') 
export class UsersController {
  constructor(@Inject(UsersService) protected userService: UsersService) {}

  @Get()
  async getAll(): Promise<UserTypeSchema> {
    return await this.userService.findAll();
  }

  @Post()
  async createUser(@Body() dto: UserDTO) {
    return await this.userService.createUser(dto);
  }

  @Delete('/:userId')
  async deleteUser(@Param() params: { userId: string }) {
    return await this.userService.deleteUser(params.userId);
  }
}
