import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filter/http-exception.filter';
import { ValidationPipeOptions } from './validation/validationPipeOptions';

export const appSettings = (app: INestApplication) => {
  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(ValidationPipeOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
