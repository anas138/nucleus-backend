import { AppType, RecordStatus } from 'src/common/enums/enums';
import {
  AlarmFilterAdvanceConditionModel,
  FetchAlarmFilterAdvanceConditionModel,
} from './alarm-filter-advance-condition.model';
import {
  AlarmRecipientModel,
  FetchAlarmRecipientModel,
} from './alarm-recipient.model';
import { AlarmFilterCOnfigEscalateTickerDeviceModel } from './alarm-filter-config-escalate-ticket-device.model';

export class AlarmFilterConfigModel {
  app_type: AppType;
  alarm_name: string;
  severity: string;
  is_regional_escalation: boolean;
  email_escalation_delay?: number;
  ticket_escalation_delay?: number;
  is_email_escalation?: boolean;
  is_ticket_escalation?: boolean;
  record_status?: RecordStatus;
  is_change_in_display_severity?: boolean;
  conditional_severity?: string;
  severity_to_be_displayed?: string;
  created_by?: number;
  updated_by?: number;
}
export class CreateALarmFilterConfigModel extends AlarmFilterConfigModel {}

export class UpdateAlarmFilterConfigModel extends AlarmFilterConfigModel {}

export class FetchAlarmFilterConfigModel extends AlarmFilterConfigModel {
  id: number;
  alarm_filter_advanced_conditions?: FetchAlarmFilterAdvanceConditionModel[];
  alarm_recipients?: FetchAlarmRecipientModel[];
  escalationTicketDevices?: AlarmFilterCOnfigEscalateTickerDeviceModel[];
}
