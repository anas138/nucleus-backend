import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as NestMailer from '@nestjs-modules/mailer';
import { SendMailModel } from 'src/models/send-mail.model';
import { APP_CONSTANTS, APP_MESSAGES, AppType } from 'src/common/enums/enums';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailer.MailerService) {}

  public async sendMail(sendMailModel: SendMailModel): Promise<any> {
    try {
      await this.mailerService.sendMail({
        ...sendMailModel,
      });
      return;
    } catch (error) {
      throw new ServiceUnavailableException(
        APP_MESSAGES.MAILER.ERROR_MAIL_SENT,
      );
    }
  }
}
