export class NokiaTxnAlarmModel {
  id?: number;
  nokia_alarm_id?: string;
  category?: string;
  event_time?: Date;
  severity?: 'critical' | 'major' | 'minor' | 'warning';
  alarm_name?: string;
  alarm_type?: string;
  probable_cause?: string;
  additional_text?: string;
  affected_object?: string;
  affected_object_name?: string;
  affected_object_type?: string;
  ne_name?: string;
  ne_ip_address?: string;
  frequency?: number;
  number_of_occurances?: number;
  first_time_detected?: Date;
  source_type?: string;
  impact?: number;
  last_time_detected?: Date;
  service_affecting?: boolean;
  region_id?: number;
  record_status?: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT';
  created_on?: Date;
  cleared_on?: Date;
  ne_nokia_id?: number;
  nokia_txn_last_modified?: Date;
  alarm_filter_config_id?: number;
  is_cleared?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
