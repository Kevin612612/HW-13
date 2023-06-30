import { Body, Controller, Post, HttpCode, HttpStatus, Inject, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { passwordRecoveryDTO } from './dto/passwordRecovery.dto';
import { UserDTO } from '../user/dto/userInputDTO';
import { UsersService } from '../user/users.service';
import { Response } from 'express';
import { EmailService } from '../email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: LoginDTO) {
    return await this.authService.login(dto);
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
