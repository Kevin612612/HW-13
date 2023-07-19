import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appSettings } from './app.settings';
import { BlackListService } from './black list/blacklist.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  appSettings(app)
  await app.listen(process.env.PORT, () => {console.log(`app listening on port ${process.env.PORT}`)});
  const blackListService = app.get(BlackListService);  
  // Execute the database request
  // await blackListService.deleteAllData();
  // await blackListService.createBlackList();
  await blackListService.deleteTokens();
  await blackListService.addToken('it\'s list of expired refresh Tokens');
}
bootstrap();
