import { Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { DeviceIdDTO } from '../dto/id.dto';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { SkipThrottle } from '@nestjs/throttler';

// changeLikeStatus
// updateCommentById
// deleteComment
// findCommentById

@SkipThrottle()
@Controller('security')
export class DevicesController {
  constructor(@Inject(RefreshTokenService) protected refreshTokenService: RefreshTokenService) {}

  //(1)
  @UseGuards(RefreshTokenGuard)
  @Get('/devices')
  async getAllDevices(@Req() req) {
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    console.log('getAllDevices', 'userId:', userId);
    return await this.refreshTokenService.allDevices(userId);
  }

  //(2)
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/devices')
  async deleteOtherDevices(@Req() req) {
    //INPUT
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    const refreshToken = req.cookies.refreshToken;
    const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken); //once guard is passed
    const deviceId = payload.deviceId;
    console.log('deleteOtherDevices', 'userId:', userId, 'deviceId:', deviceId);
    //BLL
    return await this.refreshTokenService.terminateAllOtherDevices(userId, deviceId);
  }

  //(3)
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/devices/:deviceId')
  async deleteOneDevice(@Param() params: DeviceIdDTO, @Req() req) {
    //INPUT
    const user = req.user ? req.user : null;
    const userId = user ? user.id : null;
    console.log('deleteOneDevice', 'userId:', userId);
    //BLL
    return await this.refreshTokenService.terminateCurrentDevice(userId, params.deviceId);
  }
}
