import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { APP_CONSTANTS, QUEUES } from 'src/common/enums/enums';

import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import axios from 'axios';
import { SmsModel } from 'src/models/sms.model';
const configService = new EnvironmentConfigService(new ConfigService());

@Processor(QUEUES.SMS_QUEUE)
export class SmsProcess {
  constructor() {}

  @Process()
  async sendSms(job: Job<SmsModel>) {
    await job.progress(20);

    const { data } = job;
    const to = data.to;
    const message = data.message;

    try {
      if (to && message) {
        const formatTo = this.formatMobileNumber(to);
        const payload = {
          messages: [
            {
              destinations: [
                {
                  to: formatTo,
                },
              ],
              from: APP_CONSTANTS.SMS.FROM,
              text: message,
            },
          ],
        };
        const resp = await axios.post(configService.getSmSUrl(), payload, {
          headers: {
            Authorization: 'App ' + configService.getSmsApiKey(),
          },
        });
        await job.progress(20);
        return resp.data;
      } else {
        throw new Error('Invalid Parameters !');
      }
    } catch (err) {
      throw err;
    }
  }

  formatMobileNumber(number: string) {
    let formatTo = number.replace(/\D/g, '');
    if (formatTo.startsWith('0')) {
      formatTo = '92' + formatTo.substring(1);
    }
    return formatTo;
  }
}
