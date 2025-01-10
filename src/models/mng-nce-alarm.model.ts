export const transformedNceData = (data: any) => {
  return {
    category: data.category,
    time_created: data['time-created'],
    x733_alarm_parameters: {
      event_type: data['x733-alarm-parameters']['event-type'],
    },
    alarm_state_change_parameters: {
      perceived_severity:
        data['alarm-state-change-parameters']['perceived-severity'],
      alarm_text: data['alarm-state-change-parameters']['alarm_text'],
      time: data['alarm-state-change-parameters']['time'],
    },
    alarm_parameters: {
      repair_action: data['alarm-parameters']['repair-action'],
      ne_name: data['alarm-parameters']['ne-name'],
      location_info: data['alarm-parameters']['location-info'],
      native_probable_cause: data['alarm-parameters']['native-probable-cause'],
      probable_cause: data['alarm-parameters']['probable-cause'],
      root_cause_identifier: data['alarm-parameters']['root-cause-identifier'],
      ems_time: data['alarm-parameters']['ems-time'],
      alarm_serial_number: data['alarm-parameters']['alarm-serial-number'],
      reason_id: data['alarm-parameters']['reason-id'],
      tenant_id: data['alarm-parameters']['tenant-id'],
      tenant: data['alarm-parameters']['tenant'],
      alarm_text: data['alarm-parameters']['alarm-text'],
      other_info: data['alarm-parameters']['other-info'],
      ip_address: data['alarm-parameters']['ip_address'],
    },
    common_alarm_parameters: {
      alt_resource: data['common-alarm-parameters']['alt-resource'],
      resource: data['common-alarm-parameters']['resource'],
      resource_url: data['common-alarm-parameters']['resource-url'],
      related_alarm: data['common-alarm-parameters']['related-alarm'],
      alarm_type_qualifier:
        data['common-alarm-parameters']['alarm-type-qualifier'],
      impacted_resource: data['common-alarm-parameters']['impacted-resource'],
      root_cause_resource:
        data['common-alarm-parameters']['root-cause-resource'],
      alarm_type_id: data['common-alarm-parameters']['alarm-type-id'],
      layer: data['common-alarm-parameters']['layer'],
      md_name: data['common-alarm-parameters']['md-name'],
      product_type: data['common-alarm-parameters']['product-type'],
    },
  };
};

export class CreateMngNceAlarmModel {
  category?: string;
  time_created?: Date;
  x733_alarm_parameters: {
    event_type?: string;
  };
  alarm_state_change_parameters: {
    perceived_severity?: string;
    alarm_text?: string;
    time?: Date;
  };
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
