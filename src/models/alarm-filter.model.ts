import {
  CreateALarmFilterConfigModel,
  FetchAlarmFilterConfigModel,
  UpdateAlarmFilterConfigModel,
} from './alarm-filter-config.model';
import {
  CreateALarmFilterAdvanceConditionModel,
  FetchAlarmFilterAdvanceConditionModel,
  UpdateAlarmFilterAdvanceConditionModel,
} from './alarm-filter-advance-condition.model';
import {
  CreateAlarmRecipientModel,
  FetchAlarmRecipientMappedModel,
  FetchAlarmRecipientModel,
  UpdateAlarmRecipientModel,
} from './alarm-recipient.model';
import { RecordStatus } from 'src/common/enums/enums';

export class CreateAlarmFilterModel {
  alarm_filter_config: CreateALarmFilterConfigModel;
  alarm_filter_advanced_conditions: CreateALarmFilterAdvanceConditionModel[];
  alarm_recipients: CreateAlarmRecipientModel[];
  escalation_ticket: EscalationTicketModel;
}

export class UpdateAlarmFilterModel {
  alarm_filter_config: UpdateAlarmFilterConfigModel;
  alarm_filter_advanced_conditions: UpdateAlarmFilterAdvanceConditionModel[];
  alarm_recipients: UpdateAlarmRecipientModel[];
  escalation_ticket: EscalationTicketModel;
}

export class FetchAlarmFilterModel {
  alarm_filter_config: FetchAlarmFilterConfigModel;
  alarm_filter_advanced_conditions: FetchAlarmFilterAdvanceConditionModel;
  alarm_recipients: FetchAlarmRecipientMappedModel[];
}

export class TicketEscalationDevice {
  id?: number;
  deviceId: number[] | string[];
  alarm_filter_config_id?: number;
  app_type?: string;
}

export class EscalationTicketModel {
  ticket_escalation_initial_sub_department: number;
  ticket_escalation_medium: number;
  can_revert_ticket_on_alarm_recovery: boolean;
  ticket_escalation_category: number;
  ticket_escalation_sub_category?: number;
  ticket_escalation_device?: string[] | number[];
}

export class AlarmFilterConfigQueryParam {
  status?: RecordStatus;
  is_ticket_escalation?: boolean;
  is_email_escalation?: boolean;
}
