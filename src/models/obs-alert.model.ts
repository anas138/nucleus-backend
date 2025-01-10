export interface IObsAlert {
  alert_state: string;
  alert_status: string;
  alert_severity: string;
  alert_timestamp: Date;
  alert_id: number;
  alert_message: string;
  conditions: string;
  metrics: string;
  duration: string;
  entity_name: string;
  entity_id: number;
  entity_type: string;
  entity_description: string;
  device_hostname: string;
  device_sysname: string;
  device_description: string;
  device_id: number;
  device_hardware: string;
  device_os: string;
  device_type: string;
  device_location: string;
  device_uptime: string;
  device_rebooted: Date;
  title: string;
  cleared_on?: Date;
  is_cleared?: boolean;
  alarm_filter_config_id?: number;
  nms_circuit_id?: string;
}

export const transformObserviumAlertResponse = (response: any) => {
  return {
    alert_state: response.ALERT_STATE,
    alert_status: response.ALERT_STATUS,
    alert_severity: response.ALERT_SEVERITY,
    alert_timestamp: new Date(parseInt(response.ALERT_UNIXTIME) * 1000),
    alert_id: response.ALERT_ID ? parseInt(response.ALERT_ID) : null,
    alert_message: response.ALERT_MESSAGE,
    conditions: response.CONDITIONS,
    metrics: response.METRICS,
    duration: response.DURATION,
    entity_name: response.ENTITY_NAME,
    entity_id: response.ENTITY_ID ? parseInt(response.ENTITY_ID) : null,
    entity_type: response.ENTITY_TYPE,
    entity_description: response.ENTITY_DESCRIPTION,
    device_hostname: response.DEVICE_HOSTNAME,
    device_sysname: response.DEVICE_SYSNAME,
    device_description: response.DEVICE_DESCRIPTION,
    device_id: response.DEVICE_ID,
    device_hardware: response.DEVICE_HARDWARE,
    device_os: response.DEVICE_OS,
    device_type: response.DEVICE_TYPE,
    device_location: response.DEVICE_LOCATION,
    device_uptime: response.DEVICE_UPTIME,
    device_rebooted: new Date(response.DEVICE_REBOOTED),
    title: response.TITLE,
  };
};

export const mngTransformObserviumAlertResponse = (response: any) => {
  return {
    alert_state: response.ALERT_STATE,
    alert_status: response.ALERT_STATUS,
    alert_severity: response.ALERT_SEVERITY,
    alert_timestamp: new Date(parseInt(response.ALERT_UNIXTIME) * 1000),
    alert_id: response.ALERT_ID,
    alert_message: response.ALERT_MESSAGE,
    conditions: response.CONDITIONS,
    metrics: response.METRICS,
    duration: response.DURATION,
    entity_name: response.ENTITY_NAME,
    entity_id: response.ENTITY_ID,
    entity_type: response.ENTITY_TYPE,
    entity_description: response.ENTITY_DESCRIPTION,
    device_hostname: response.DEVICE_HOSTNAME,
    device_sysname: response.DEVICE_SYSNAME,
    device_description: response.DEVICE_DESCRIPTION,
    device_id: response.DEVICE_ID,
    device_hardware: response.DEVICE_HARDWARE,
    device_os: response.DEVICE_OS,
    device_type: response.DEVICE_TYPE,
    device_location: response.DEVICE_LOCATION,
    device_uptime: response.DEVICE_UPTIME,
    device_rebooted: new Date(response.DEVICE_REBOOTED),
    title: response.TITLE,
    alert_emoji: response.ALERT_EMOJI,
    alert_emoji_name: response.ALERT_EMOJI_NAME,
    alert_color: response.ALERT_COLOR,
    alert_url: response.ALERT_URL,
    alert_timestamp_rfc2822: response.ALERT_TIMESTAMP_RFC2822,
    alert_timestamp_rfc3339: response.ALERT_TIMESTAMP_RFC3339,
    entity_url: response.ENTITY_URL,
    entity_link: response.ENTITY_LINK,
    device_url: response.DEVICE_URL,
    device_link: response.DEVICE_LINK,
  };
};
