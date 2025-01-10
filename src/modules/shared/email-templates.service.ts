import { Injectable } from '@nestjs/common';
import { AppType, EMAIL_TEMPLATES } from 'src/common/enums/enums';
import path, { join } from 'path';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { DATE_FORMATS } from 'src/common/enums/enums';
import {
  SetupPasswordMailModel,
  UpdatePasswordEmailModel,
} from 'src/models/email.mode';
import { CreateUserModel, FetchUserModel } from 'src/models/user.model';
import { ReturnTroubleTicketModel } from 'src/models/trouble-ticket.model';
import { NceGponAlarm } from 'src/entities/nce-gpon-alarm.entity';

const configService = new EnvironmentConfigService(new ConfigService());

@Injectable()
export class EmailTemplatesService {
  public async getNceAlarmEmailTemplate(data: NceAlarm) {
    if (data) {
      const formateDate = moment(data?.created_on).format(
        DATE_FORMATS.DATETIME,
      );
      const updatedData = { ...data, created_on: formateDate };
      const templateHtml = fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/nce-alarm.email.hbs`,
        ),
        'utf8',
      );
      const image = fs.readFileSync(
        join(`${__dirname}/../../../public/images/twa-logo-base64`),
      );
      const template = handlebars.compile(templateHtml);
      const htmlBody = template({
        data: updatedData,
        signature: EMAIL_TEMPLATES.SIGNATURE,
        logo: image,
        url: `${configService.getWebBaseUrl()}/alarms/transmission/details/${
          data.id
        }`,
      });
      return htmlBody;
    }
  }

  public async getGponNceAlarmEmailTemplate(data: NceGponAlarm) {
    if (data) {
      const formateDate = moment(data?.created_on).format(
        DATE_FORMATS.DATETIME,
      );
      const updatedData = { ...data, created_on: formateDate };
      const templateHtml = fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/nce-gpon-alarm.email.hbs`,
        ),
        'utf8',
      );
      const image = fs.readFileSync(
        join(`${__dirname}/../../../public/images/twa-logo-base64`),
      );
      const template = handlebars.compile(templateHtml);
      const htmlBody = template({
        data: updatedData,
        signature: EMAIL_TEMPLATES.SIGNATURE,
        logo: image,
        url: `${configService.getWebBaseUrl()}/alarms/nce-gpon/details/${
          data.id
        }`,
      });
      return htmlBody;
    }
  }

  public async getNokiaTxnAlarmEmailTemplate(data: any) {
    if (data) {
      const formateDate = moment(data?.created_on).format(
        DATE_FORMATS.DATETIME,
      );
      const updatedData = { ...data, created_on: formateDate };
      const templateHtml = fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/nokia-txn-alarm.email.hbs`,
        ),
        'utf8',
      );
      const image = fs.readFileSync(
        join(`${__dirname}/../../../public/images/twa-logo-base64`),
      );
      const template = handlebars.compile(templateHtml);
      const htmlBody = template({
        data: updatedData,
        signature: EMAIL_TEMPLATES.SIGNATURE,
        logo: image,
        url: `${configService.getWebBaseUrl()}/alarms/nokia-txn/details/${
          data.id
        }`,
      });
      return htmlBody;
    }
  }

  public async getLdiSoftswitchmEmailTemplate(data: any) {
     if (data) {
       const formateDate = moment(data?.created_on).format(
         DATE_FORMATS.DATETIME,
       );
       const updatedData = { ...data, created_on: formateDate };
       const templateHtml = fs.readFileSync(
         join(
           `${__dirname}/../../template/handlebars/emails/ldi-softswitch-alarm.email.hbs`,
         ),
         'utf8',
       );
       const image = fs.readFileSync(
         join(`${__dirname}/../../../public/images/twa-logo-base64`),
       );
       const template = handlebars.compile(templateHtml);
       const htmlBody = template({
         data: updatedData,
         signature: EMAIL_TEMPLATES.SIGNATURE,
         logo: image,
         url: `${configService.getWebBaseUrl()}/alarms/ldi-softswitch/details/${
           data.id
         }`,
       });
       return htmlBody;
     }
  }

  public async getObsAlarmEmailTempalte(data: ObserviumAlert) {
    if (data) {
      const formateDate = moment(data?.alert_timestamp).format(
        DATE_FORMATS.DATETIME,
      );
      const updatedData = { ...data, alert_timestamp: formateDate };
      const templateHtml = fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/obs-alert.email.hbs`,
        ),
        'utf8',
      );
      const image = fs.readFileSync(
        join(`${__dirname}/../../../public/images/twa-logo-base64`),
      );
      const template = handlebars.compile(templateHtml);
      const htmlBody = template({
        data: updatedData,
        signature: EMAIL_TEMPLATES.SIGNATURE,
        logo: image,
        url: `${configService.getWebBaseUrl()}/alarms/ip/details/${data.id}`,
      });
      return htmlBody;
    }
  }

  public getResetPasswordTemplate(
    updatePasswordEmailModel: UpdatePasswordEmailModel,
  ) {
    const { token, email, name } = updatePasswordEmailModel;
    const templateHtml = fs.readFileSync(
      join(
        `${__dirname}/../../template/handlebars/emails/reset-password.email.hbs`,
      ),
      'utf8',
    );
    const image = fs.readFileSync(
      join(`${__dirname}/../../../public/images/twa-logo-base64`),
    );
    const template = handlebars.compile(templateHtml);
    const htmlBody = template({
      data: {
        name,
        email,
      },
      signature: EMAIL_TEMPLATES.SIGNATURE,
      logo: image,
      url: `${configService.getWebBaseUrl()}/password-update?token=${token}&email=${email}&name=${name}`,
    });
    return htmlBody;
  }

  public getSetupPasswordTemplate(
    setupPasswordMailModel: SetupPasswordMailModel,
  ) {
    const { token, email, name, username } = setupPasswordMailModel;
    const templateHtml = fs.readFileSync(
      join(
        `${__dirname}/../../template/handlebars/emails/setup-password.email.hbs`,
      ),
      'utf8',
    );
    const image = fs.readFileSync(
      join(`${__dirname}/../../../public/images/twa-logo-base64`),
    );
    const template = handlebars.compile(templateHtml);
    const htmlBody = template({
      data: {
        username,
        name,
        email,
      },
      signature: EMAIL_TEMPLATES.SIGNATURE,
      logo: image,
      url: `${configService.getWebBaseUrl()}/password-update?token=${token}&email=${email}&name=${name}`,
    });
    return htmlBody;
  }

  async getTroubleTicketEmailTemplate(
    data: ReturnTroubleTicketModel,
    subject: string,
    toUser: FetchUserModel | CreateUserModel,
  ) {
    const updatedData = { ...data };
    const troubleTicketDetailTemplateHtml = fs.readFileSync(
      join(
        `${__dirname}/../../template/handlebars/emails/trouble-ticket-detail-partial.email.hbs`,
      ),
      'utf8',
    );
    handlebars.registerPartial(
      'troubleTicketDetail',
      troubleTicketDetailTemplateHtml,
    );

    const appType = {
      NCE: fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/trouble-ticket-partial-nce.email.hbs`,
        ),
        'utf8',
      ),
      OBSERVIUM: fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/trouble-ticket-partial-obs.email.hbs`,
        ),
        'utf8',
      ),
      NCE_GPON: fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/trouble-ticket-partial-nce-gpon.email.hbs`,
        ),
        'utf8',
      ),
      NOKIA_TXN: fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/trouble-ticket-partial-nokia-txn.email.hbs`,
        ),
        'utf8',
      ),
      LDI_SOFTSWITCH_EMS: fs.readFileSync(
        join(
          `${__dirname}/../../template/handlebars/emails/trouble-ticket-partial-ldi-softswitch-ems.email.hbs`,
        ),
        'utf8',
      ),
    };
    const footerHtml = fs.readFileSync(
      join(`${__dirname}/../../template/handlebars/emails/footer.hbs`),

      'utf8',
    );
    const alarmTemplateHtml = appType[data.app_type];
    handlebars.registerPartial('AlarmDetail', alarmTemplateHtml);
    handlebars.registerPartial('Footer', footerHtml);
    const templateHtml = fs.readFileSync(
      join(
        `${__dirname}/../../template/handlebars/emails/trouble-ticket.email.hbs`,
      ),
      'utf8',
    );
    const image = fs.readFileSync(
      join(`${__dirname}/../../../public/images/twa-logo-base64`),
    );
    const template = handlebars.compile(templateHtml);
    const htmlBody = template({
      data: updatedData,
      toUser: toUser.full_name,
      logo: image,
      url: `${configService.getWebBaseUrl()}${configService.getTroubleTicketNotificationRoute()}/${
        data.id
      }`,
      title: subject,
    });
    return htmlBody;
  }
}
