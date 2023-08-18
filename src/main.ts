import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appSettings } from './app.settings';
import { Logger } from '@nestjs/common';
import { getFunctionName } from './secondary functions/getFunctionName';
import { preliminaryActions } from './pre-operations';
import { ConfigService } from '@nestjs/config';

/**
 * Entrance into the app
 */

async function bootstrap() {
	const logger = new Logger(getFunctionName());

	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	appSettings(app);

	const configService: ConfigService = app.get(ConfigService);
	const port = configService.get('PORT') || 6000;

	/** preliminary operations */
	preliminaryActions(app);

	await app.listen(port, () => {
		console.log('##########################################################')
		logger.log(`App started listening on port ${port} at ${new Date()}`);
	});
}

bootstrap();
