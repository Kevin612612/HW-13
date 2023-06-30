import { Body, Controller, Post, HttpCode, HttpStatus, Inject, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { passwordRecoveryDTO } from './dto/passwordRecovery.dto';
import { UserDTO } from '../user/dto/userInputDTO';
import { UsersService } from '../user/users.service';
import { Request, Response } from 'express';
import { EmailService } from '../email/email.service';

import requestIp from 'request-ip';
import DeviceDetector from 'node-device-detector';

import UAParser from 'ua-parser-js';
import { RefreshTokensRepository } from '../tokens/refreshtoken.repository';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(RefreshTokensRepository) private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDTO, @Req() req: Request, @Res() res: Response) {
    //collect data from request
    const IP = req.socket.remoteAddress || 'noIp';
    const userAgent = req.headers['user-agent'];
    const deviceName = 'device';
    const deviceId = await this.refreshTokensRepository.createDeviceId();
    //create tokens
    const tokens = await this.authService.login(dto, deviceId, deviceName, IP);
    //send them
    res
      .cookie('refreshToken', tokens.refreshToken.value, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json(tokens.accessToken);
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() dto: passwordRecoveryDTO) {
    return await this.authService.sendRecoveryCode(dto.email);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('registration-confirmation')
  async registrationConfirmation(@Body() dto, @Res() res: Response) {
    const result = await this.usersService.confirmCodeFromEmail(dto.code);
    if (!result) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async registration(@Body() dto: UserDTO) {
    return await this.usersService.newRegisteredUser(dto);
  }

  @Post('registration-email-resending')
  async resendRegistrationCode(@Body() dto, @Res() res: Response) {
    const result = await this.emailService.sendEmailConfirmationMessageAgain(dto.email);
    if (!result) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }
}
