import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { SendMailDto } from 'src/dto/mailer/send-mail.dto';

@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  @ResponseMessageMetadata(APP_MESSAGES.MAILER.MAIL_SENT)
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailerService.sendMail(sendMailDto);
  }
}
