import { Module } from '@nestjs/common';
import { RefreshToken, RefreshTokenSchema } from '../tokens/refreshtoken.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '../tokens/tokens.module';
import { RefreshTokensRepository } from '../tokens/refreshtoken.repository';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { DevicesController } from './devices.controller';
import { BlackListModule } from '../black list/blacklist.module';
import { UserModule } from '../user/user.module';

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
    providers: [RefreshTokenService, RefreshTokensRepository],
    exports: [],
  })
  export class DevicesModule {}
