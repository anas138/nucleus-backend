import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config/environment-config.service';

const configService = new EnvironmentConfigService(new ConfigService());

export const smtpOptions = (isTestingAccount) => {
  return isTestingAccount
    ? {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: configService.getSmtpUsername(),
          pass: configService.getSmtpPassword(),
        },
      }
    : {
        port: 25,
        host: 'smtplocal.tes.com.pk',
        secure: false, // true for 465, false for other ports
        tls: {
          rejectUnauthorized: false,
        },
      };
};
