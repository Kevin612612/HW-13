import { Controller, Delete, Get, HttpCode, Inject } from '@nestjs/common';

import { AppService } from './app.service';
import { UserRepository } from './user/users.repository';

@Controller()
export class AppController {

  constructor(@Inject(AppService) private readonly appService: AppService,
              @Inject(UserRepository) protected userRepository: UserRepository) {}

  @Get()
  hello() {
    return this.appService.getHello()
  }

  @Delete('testing/all-data')
  @HttpCode(204)
  async alldata() {
    await this.userRepository.deleteAll()
  }
}

 
