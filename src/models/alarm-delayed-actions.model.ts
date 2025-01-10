import { AppType, EscalationType } from 'src/common/enums/enums';

export class AlarmDelayedActionsModel {
  alarmConfigId: number;
  alarmId: number;
  escalationType:
    | EscalationType.EMAIL
    | EscalationType.TROUBLE_TICKET
    | EscalationType.SMS;
  appType: AppType;
}
