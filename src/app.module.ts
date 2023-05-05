import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { UsersController } from './user/users.controller';
import { AppService } from './app.service';
import { UsersService } from './user/users.service';
import { User, UserSchema } from './user/users.schema';
import { UserRepository } from './user/users.repository';

//root module
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, UsersController],
  providers:   [AppService,    UsersService, UserRepository],
})
export class AppModule {
  //empty class
}
