import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../user/users.repository';

@Injectable()
export class EmailService {
  constructor(
    @Inject(MailerService) private mailerService: MailerService,
    @Inject(UserRepository) private userRepository: UserRepository,
  ) {}

  async sendRecoveryCode(email: string) {
    const user = await this.userRepository.findUserByLoginOrEmail(email);
    const recoveryCode = uuidv4();
    const result = await this.userRepository.updateDate(user!, recoveryCode);
    const message = `<h1>Thank for your registration</h1>
          <p>To finish registration please follow the link below:
              <a href='https://hw-7-sigma.vercel.app/auth/registration-confirmation?code=${recoveryCode}'>complete registration</a>
          </p>`;
    await this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'kevin6121991@gmail.com', // Senders email address
        subject: 'Confirmation Code', // Subject line
        text: 'Hello', // plaintext body
        html: message, // HTML body content
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async sendEmailConfirmationMessage(userId: string, email: string, code: string) {
    const result = await this.userRepository.updateDate(userId, code);
    const message = `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
          <a href='https://hw-7-sigma.vercel.app/auth/registration-confirmation?code=${code}'>complete registration</a>
      </p>`;
    return await this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'kevin6121991@gmail.com', // Senders email address
        subject: 'Confirmation Code', // Subject line
        text: 'Hello', // plaintext body
        html: message, // HTML body content
      })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
