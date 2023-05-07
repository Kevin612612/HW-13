import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';


async function bootstrap() {
  //create app
  const app = await NestFactory.create(AppModule);
  //allows the application to be accessed from other domains
  app.enableCors();
  //binding ValidationPipe at the application level
  app.useGlobalPipes(new ValidationPipe());
  //container is used by class-validor library
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  //start app
  await app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
  });
}
bootstrap();

