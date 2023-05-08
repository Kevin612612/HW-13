import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserDTO } from '../dto/user.dto';
import { UserTypeSchema } from '../types/users';
import { UsersService } from './users.service';
import { QueryUserDTO } from '../dto/query.dto';
import { Response } from 'express';
import { UserIdDTO } from '../dto/id.dto';


@Controller('users') 
export class UsersController {
  constructor(@Inject(UsersService) protected userService: UsersService) {}

  @Get()
  async getAll(@Query() query: QueryUserDTO): Promise<UserTypeSchema> {
    return await this.userService.findAll(query);
  }

  @Post()
  async createUser(@Body() dto: UserDTO) {
    return await this.userService.createUser(dto);
  }

  @Delete('/:userId')
  async deleteUserById(@Param() params: UserIdDTO, @Res() res: Response) {
    const result = await this.userService.deleteUserById(params.userId);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  }
}
