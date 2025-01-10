import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateMngObsAlertsDto {
  @IsOptional()
  @IsString()
  alert_state: string;

  @IsOptional()
  @IsString()
  alert_emoji: string;

  @IsOptional()
  @IsString()
  alert_emoji_name: string;

  @IsOptional()
  @IsString()
  alert_status: string;

  @IsOptional()
  @IsString()
  alert_severity: string;

  @IsOptional()
  @IsString()
  alert_color: string;

  @IsOptional()
  @IsString()
  alert_url: string;

  @IsOptional()
  @IsDate()
  me: Date;

  @IsOptional()
  @IsDate()
  alert_timestamp: Date;

  @IsOptional()
  @IsDate()
  alert_timestamp_rfc2822: Date;

  @IsOptional()
  @IsDate()
  alert_timestamp_rfc3339: Date;

  @IsOptional()
  @IsString()
  alert_id: string;

  @IsOptional()
  @IsString()
  alert_message: string;

  @IsOptional()
  @IsString()
  conditions: string;

  @IsOptional()
  @IsString()
  metrics: string;

  @IsOptional()
  @IsString()
  duration: string;

  @IsOptional()
  @IsString()
  entity_url: string;

  @IsOptional()
  @IsString()
  entity_link: string;

  @IsOptional()
  @IsString()
  entity_name: string;

  @IsOptional()
  @IsString()
  entity_id: string;

  @IsOptional()
  @IsString()
  entity_type: string;

  @IsOptional()
  @IsString()
  entity_description: string;

  @IsOptional()
  @IsString()
  device_hostname: string;

  @IsOptional()
  @IsString()
  device_sysname: string;

  @IsOptional()
  @IsString()
  device_description: string;

  @IsOptional()
  @IsString()
  device_id: string;

  @IsOptional()
  @IsString()
  device_url: string;

  @IsOptional()
  @IsString()
  device_link: string;

  @IsOptional()
  @IsString()
  device_hardware: string;

  @IsOptional()
  @IsString()
  device_os: string;

  @IsOptional()
  @IsString()
  device_type: string;

  @IsOptional()
  @IsString()
  device_location: string;

  @IsOptional()
  @IsString()
  device_uptime: string;

  @IsOptional()
  @IsDate()
  device_rebooted: Date;

  @IsOptional()
  @IsString()
  title: string;
}
