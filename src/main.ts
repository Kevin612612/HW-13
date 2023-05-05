import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //create app
  const app = await NestFactory.create(AppModule);
  //allows the application to be accessed from other domains
  app.enableCors();
  //start app
  await app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
  });
}
bootstrap();
