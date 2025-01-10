import { IsString, IsDate, IsObject, IsOptional } from 'class-validator';
export class CreateMngNceAlarmDto {
  @IsString()
  category?: string;

  @IsDate()
  time_created?: Date;

  @IsObject()
  x733_alarm_parameters: {
    event_type?: string;
  };

  @IsObject()
  alarm_state_change_parameters: {
    perceived_severity?: string;
    alarm_text: string;
    time?: Date;
  };

  @IsObject()
  alarm_parameters: {
    repair_action?: string;
    ne_name?: string;
    location_info?: string;
    native_probable_cause?: string;
    probable_cause?: string;
    root_cause_identifier?: string;
    ems_time?: string;
    alarm_serial_number?: string;
    reason_id?: string;
    tenant_id?: string;
    tenant?: string;
    alarm_text?: string;
    other_info?: string;
    ip_address?: string;
  };

  @IsObject()
  common_alarm_parameters: {
    alt_resource?: string;
    resource?: string;
    resource_url?: string;
    related_alarm?: string;
    alarm_type_qualifier?: string;
    impacted_resource?: string;
    root_cause_resource?: string;
    alarm_type_id?: string;
    layer?: string;
    md_name?: string;
    product_type?: string;
  };
}
