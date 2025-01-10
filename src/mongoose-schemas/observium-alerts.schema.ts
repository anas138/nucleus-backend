import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ObsDocument = HydratedDocument<ObsAlerts>;

@Schema({ timestamps: true, collection: 'obs_alert' })
export class ObsAlerts {
  @Prop()
  alert_state: string;

  @Prop()
  alert_emoji: string;

  @Prop()
  alert_emoji_name: string;

  @Prop()
  alert_status: string;

  @Prop()
  alert_severity: string;

  @Prop()
  alert_color: string;

  @Prop()
  alert_url: string;

  @Prop()
  alert_unixtime: Date;

  @Prop()
  alert_timestamp: Date;

  @Prop()
  alert_timestamp_rfc2822: Date;

  @Prop()
  alert_timestamp_rfc3339: Date;

  @Prop()
  alert_id: string;

  @Prop()
  alert_message: string;

  @Prop()
  conditions: string;

  @Prop()
  metrics: string;

  @Prop()
  duration: string;

  @Prop()
  entity_url: string;

  @Prop()
  entity_link: string;

  @Prop()
  entity_name: string;

  @Prop()
  entity_id: string;

  @Prop()
  entity_type: string;

  @Prop()
  entity_description: string;

  @Prop()
  device_hostname: string;

  @Prop()
  device_sysname: string;

  @Prop()
  device_description: string;

  @Prop()
  device_id: string;

  @Prop()
  device_url: string;

  @Prop()
  device_link: string;

  @Prop()
  device_hardware: string;

  @Prop()
  device_os: string;

  @Prop()
  device_type: string;

  @Prop()
  device_location: string;

  @Prop()
  device_uptime: string;

  @Prop()
  device_rebooted: Date;

  @Prop()
  title: string;
}

export const ObserviumSchema = SchemaFactory.createForClass(ObsAlerts);
ObserviumSchema.index({ title: 1 });
ObserviumSchema.index({ alert_message: 1 });
ObserviumSchema.index({ alert_timestamp: 1 });
ObserviumSchema.index({ createdAt: 1 });
ObserviumSchema.index({ alert_state: 1 });
