import { Module } from '@nestjs/common';
import { RefreshToken, RefreshTokenSchema } from '../entity_tokens/refreshtoken.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '../entity_tokens/tokens.module';
import { RefreshTokensRepository } from '../entity_tokens/refreshtoken.repository';
import { RefreshTokenService } from '../entity_tokens/refreshtoken.service';
import { DevicesController } from './devices.controller';
import { BlackListModule } from '../entity_black_list/blacklist.module';
import { UserModule } from '../entity_user/user.module';
import { DeviceExistsValidation } from '../validation/deviceValidation';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: RefreshToken.name, schema: RefreshTokenSchema },
      ]),
      UserModule,
      TokenModule,
      BlackListModule,
    ],
    controllers: [DevicesController],
    providers: [RefreshTokenService, RefreshTokensRepository, DeviceExistsValidation],
    exports: [],
  })
  export class DevicesModule {}
