import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config/environment-config.service';
import { smtpOptions } from './smtp-options';
import { APP_CONSTANTS } from 'src/common/enums/enums';
const configService = new EnvironmentConfigService(new ConfigService());

const getFromRecipientEnv = () => {
  const appEnv = configService.getAppEnv();
  if (appEnv === APP_CONSTANTS.APP_ENVS.PROD) {
    return ''; // Return empty string if the environment is 'prod'
  }
  return appEnv ? appEnv.charAt(0).toUpperCase() + appEnv.slice(1).toLowerCase() + ' ' : '';
}

export const EmailConfig = {
  from: `${getFromRecipientEnv()}"Nucleus" nucleus-alerts@tw1.com`,
  smtpOptions: smtpOptions(configService.getIsSmtpTestingAccount()),
};
