import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filter/http-exception.filter';
import { ValidationPipeOptions } from './validation/validationPipeOptions';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BlackListService } from './black list/blacklist.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Get the Mongoose connection instance
  const mongooseConnection = new MongooseModule();
  

  // Check if the connection is successful
  // if (mongooseConnection.readyState === 1) {
  //   console.log('Mongoose connection established successfully!');
  // } else {
  //   console.log('Failed to establish Mongoose connection!');
  // }
  const blackListService = app.get(BlackListService);  

  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(ValidationPipeOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  //It allows class-validator to use NestJS dependency injection container
  await app.listen(process.env.PORT, () => {console.log(`app listening on port ${process.env.PORT}`, mongooseConnection)});
  // Execute the database request
  // await blackListService.deleteAllData();
  // await blackListService.createBlackList();  
  // await blackListService.addToken('it\'s list of expired refresh Tokens');
}
bootstrap();
