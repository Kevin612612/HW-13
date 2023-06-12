import { Body, Controller, Post, HttpCode, HttpStatus, Inject, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signIn.dto';
import { AuthGuard } from './auth.guard';
import { passwordRecoveryDTO } from './dto/passwordRecovery.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: SignInDTO) {
    return await this.authService.signIn(dto.loginOrEmail, dto.password);
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() dto: passwordRecoveryDTO) {
    return await this.authService.sendRecoveryCode(dto.email)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
