import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import * as NestMailer from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerController } from './mailer.controller';
import { join } from 'path';
import { EnvironmentConfigModule } from 'src/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { EmailConfig } from 'src/config/email.config';

@Module({
  imports: [
    NestMailer.MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      useFactory: async (configService: EnvironmentConfigService) => ({
        transport: {
          ...EmailConfig.smtpOptions,
        },
        /**
         * mailer-module `from` recipient should only be changed if its different than 'nucleus-alerts@tw1.com` aka EmailConfig.from | else do not override from any child service
         */
        defaults: {
          from: EmailConfig.from,
        },
        preview: configService.getIsSmtpTestingAccount(),
        template: {
          dir: join(__dirname, '../..', '/template', 'handlebars', 'emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [EnvironmentConfigService],
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
