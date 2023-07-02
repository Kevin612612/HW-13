import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filter/http-exception.filter';
import { ValidationPipeOptions } from './validation/validationPipeOptions';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BlackListService } from './black list/blacklist.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const blackListService = app.get(BlackListService);  

  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(ValidationPipeOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  //It allows class-validator to use NestJS dependency injection container
  await app.listen(process.env.PORT, () => {console.log(`app listening on port ${process.env.PORT}`)});
  // Execute the database request
  // await blackListService.deleteAllData();
  // await blackListService.createBlackList();  
  // await blackListService.addToken('it\'s list of expired refresh Tokens');
}
bootstrap();
