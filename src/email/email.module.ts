import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { UsersService } from '../user/users.service';
import { UserRepository } from '../user/users.repository';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('SMTP_USERNAME'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Nice App" <${config.get('SMTP_USERNAME')}>`,
        },
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new EjsAdapter(),
        //   options: {
        //     strict: false,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
    UserModule
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
