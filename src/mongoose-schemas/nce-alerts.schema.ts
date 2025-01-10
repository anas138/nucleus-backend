import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class AlarmStateChangeParameters {
  @Prop()
  perceived_severity: string;
  @Prop()
  alarm_text: string;
  @Prop()
  time: Date;
}

export class x733AlarmParameters {
  @Prop()
  event_type: string;
}

export class AlarmParameters {
  @Prop()
  repair_action: string;

  @Prop()
  ne_name: string;

  @Prop()
  location_info: string;

  @Prop()
  native_probable_cause: string;

  @Prop()
  probable_cause: string;

  @Prop()
  root_cause_identifier: boolean;

  @Prop()
  ems_time: string;

  @Prop()
  alarm_serial_number: string;

  @Prop()
  reason_id: number;

  @Prop()
  tenant_id: string;

  @Prop()
  tenant: string;

  @Prop()
  alarm_text: string;

  @Prop()
  other_info: string;

  @Prop()
  ip_address: string;
}

export class CommonAlarmParameters {
  @Prop()
  alt_resource: [];

  @Prop()
  resource: string;

  @Prop()
  resource_url: string;

  @Prop()
  related_alarm: [];

  @Prop()
  alar_type_qualifier: string;

  @Prop()
  impacted_resource: [''];

  @Prop()
  root_cause_resource: [];

  @Prop()
  alarm_type_id: string;

  @Prop()
  layer: string;

  @Prop()
  md_name: string;

  @Prop()
  product_type: string;
}

export type NceDocument = HydratedDocument<NceAlerts>;

@Schema({ timestamps: true, collection: 'nce_alarm' })
export class NceAlerts {
  @Prop()
  category: string;

  @Prop()
  time_created: Date;

  @Prop({ type: x733AlarmParameters })
  x733_alarm_parameters: {};

  @Prop({ type: AlarmStateChangeParameters })
  alarm_state_change_parameters: {};

  @Prop({ type: AlarmParameters })
  alarm_parameters: {};

  @Prop({ type: CommonAlarmParameters })
  common_alarm_parameters: {};
}

export const NceSchema = SchemaFactory.createForClass(NceAlerts);
NceSchema.index({ category: 1 });
NceSchema.index({ time_created: 1 });
NceSchema.index({ 'x733_alarm_parameters.event_type': 1 });
NceSchema.index({ 'alarm_state_change_parameters.perceived_severity': 1 });
NceSchema.index({ 'alarm_parameters.ne_name': 1 });
NceSchema.index({ 'alarm_parameters.ip_address': 1 });
NceSchema.index({ 'alarm_parameters.alarm_serial_number': 1 });
NceSchema.index({ 'alarm_parameters.native_probable_cause': 1 });
NceSchema.index({ 'common_alarm_parameters.resource': 1 });
NceSchema.index({ 'common_alarm_parameters.alarm_type_id': 1 });
NceSchema.index({ 'common_alarm_parameters.md_name': 1 });
NceSchema.index({ 'common_alarm_parameters.product_type': 1 });
