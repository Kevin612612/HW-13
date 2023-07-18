import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
  Get,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { passwordRecoveryDTO } from './dto/passwordRecovery.dto';
import { UserDTO } from '../user/dto/userInputDTO';
import { UsersService } from '../user/user.service';
import { Response, Request } from 'express';
import { EmailService } from '../email/email.service';

import { RefreshTokensRepository } from '../tokens/refreshtoken.repository';
import { RefreshTokenService } from '../tokens/refreshtoken.service';
import { UserRepository } from '../user/user.repository';
import { BlackListService } from '../black list/blacklist.service';
import { AccessTokenService } from '../tokens/accesstoken.service';
import { NewPasswordDTO } from './dto/newPassword.dto';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { CodeConfirmationDTO } from './dto/registrationConfirmation.dto';
import { EmailResendDTO } from './dto/registrationEmailConfirmed.dto';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { UserExtractGuard } from '../guards/extractUser.guard';

// passwordRecovery
// newPassword
// login
// newPairOfTokens
// registrationConfirmation
// registration
// resendRegistrationCode
// logout
// getInfo

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(AccessTokenService) private accessTokenService: AccessTokenService,
    @Inject(RefreshTokenService) private refreshTokenService: RefreshTokenService,
    @Inject(BlackListService) private blackListService: BlackListService,
    @Inject(RefreshTokensRepository) private refreshTokensRepository: RefreshTokensRepository,
    @Inject(UserRepository) private userRepository: UserRepository,
  ) {}

  @Post('password-recovery')
  async passwordRecovery(@Body() dto: passwordRecoveryDTO) {
    return await this.authService.sendRecoveryCode(dto.email);
  }

  @Post('new-password')
  async newPassword(@Body() dto: NewPasswordDTO) {
    const user = await this.userRepository.findUserByPasswordCode(dto.recoveryCode);
    //BLL
    if (user) {
      const result = await this.usersService.updatePassword(user.id, dto.newPassword);
      return result;
    } else {
      throw new BadRequestException(['the inputModel has incorrect value or RecoveryCode is incorrect or expired']);
    }
  }

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
      .send(tokens.accessToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async newPairOfTokens(@Req() req: Request, @Res() res: Response) {
    //INPUT
    const refreshToken = req.cookies.refreshToken;
    const IP = req.socket.remoteAddress || 'noIp';
    const userAgent = req.headers['user-agent'];
    const deviceName = 'device';
    const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken); //once middleware is passed
    const user = await this.userRepository.findUserById(payload.userId);
    const deviceId = payload.deviceId;
    // BLL
    // since validation is passed, so we can add refreshToken in black list
    const result = await this.blackListService.addToken(refreshToken);
    // //...and delete from DB
    const deleteRefreshToken = await this.refreshTokensRepository.deleteOne(user.id, deviceId);
    // //RETURN
    if (user) {
      //create the pair of tokens and put them into db
      const accessTokenObject = await this.accessTokenService.generateAccessJWT(user);
      const refreshTokenObject = await this.refreshTokenService.generateRefreshJWT(user, deviceId, deviceName, IP);
      console.log('new created access token', accessTokenObject.accessToken);
      console.log('new created refresh token', refreshTokenObject.value);
      //send response with tokens
      res
        .cookie('refreshToken', refreshTokenObject.value, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send({accessToken: accessTokenObject.accessToken});
    } else {
      res.sendStatus(401);
    }
  }

  @UseGuards(AuthGuardBearer)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('registration-confirmation')
  async registrationConfirmation(@Body() dto: CodeConfirmationDTO, @Res() res: Response) {    
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
  async resendRegistrationCode(@Body() dto: EmailResendDTO, @Res() res: Response) {
    const result = await this.emailService.sendEmailConfirmationMessageAgain(dto.email);
    if (!result) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    //INPUT
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    const payload = await this.refreshTokenService.getPayloadFromRefreshToken(refreshToken);
    console.log(payload);

    //BLL
    //make refreshToken Expired/Invalid
    const result = await this.refreshTokenService.makeRefreshTokenExpired(refreshToken);
    console.log(result);

    //...and delete from DB
    const deleteRefreshToken = await this.refreshTokensRepository.deleteOne(payload.userId, payload.deviceId);
    console.log(deleteRefreshToken);

    //RETURN
    //clear the refreshToken from the cookies
    res.clearCookie('refreshToken').status(204).send("you're quit");
  }

  @UseGuards(UserExtractGuard)
  @Get('me')
  async getInfo(@Req() req: Request, @Res() res: Response) {
    //INPUT
    const user = req.user ? req.user : null;
    res.status(200).json({
      email: user.accountData.email,
      login: user.accountData.login,
      userId: user.id,
    });
  }
}
