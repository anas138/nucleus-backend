import { AlarmStatus } from 'src/common/enums/enums';

export class BasicAlarmSearchFilterModel {
  alarmName?: string;
  severity?: string;
  alarmStatus?: AlarmStatus;
  devices?: string;
  lastOccurredFrom?: Date;
  lastOccurredTo?: Date;
  alarmFilterConfigId?: number;
  entity_name?: string;
  deviceName?: string;
}
