import { FiltersTemplateModule } from 'src/modules/filters-template/filters-template.module';
import { PaginationQueryModel } from './pagination.model';
import { RecordStatus } from 'src/common/enums/enums';

export class LdiSoftswitchAlarmQueueMessage {
  ems_alarm_id: string;
  category: string;
  event_time: string;
  source_ip: string;
  severity: string;
  class_txt: string;
  syslog_ip: string;
  syslog_source: string;
  error_code: string;
  message: string;
  message_state: string;
  trunk_group: string;
  type_txt: string;
  subtype_txt: string;
}

export class LdiSoftySwitchAlarms extends LdiSoftswitchAlarmQueueMessage {
  id: number;
  ldi_softswitch_trunk_group_id: number;
  is_cleared: boolean;
  created_on: Date;
  cleared_on: Date | null;
  alarm_type: number;
  alarm_filter_config_id: number;
  record_status: RecordStatus;
  actual_severity: string;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}

export class LdiSoftswitchAlarmsFilterModel extends PaginationQueryModel {
  category: string;
  severity: string;
  alarmType: string;
  trunkGroup: string;
  lastOccurredFrom: string;
  lastOccurredTo: string;
  alarmFilterConfigId: string;
  alarmStatus: String;
}
