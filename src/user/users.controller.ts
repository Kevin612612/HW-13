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

@Controller('users') //route /users/...
export class UsersController {

  
  constructor(@Inject(UsersService) protected userService: UsersService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() dto: UserDTO) {
    return this.userService.createUser(dto);    
  }

  @Delete('/:userId')
  async deleteUser(@Param() params: {userId: string}) {
    return await this.userService.deleteUser(params.userId);
  }
}

