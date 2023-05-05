import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //create app
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  //start app
  await app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
  });
}
bootstrap();
