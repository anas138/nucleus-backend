import { NceGponNetworkElement } from 'src/entities/nce-gpon-network-element.entity';

export interface NCEGponAlarmModel {
  id?: number;
  severity: string;
  category: string;
  event_type: string;
  nce_alarm_id: number;
  alarm_text: string;
  alarm_serial_number: string;
  alarm_type_id?: string;
  layer: string;
  md_name: string;
  probable_cause: string;
  native_probable_cause: string;
  location_info: string;
  ne_name: string;
  ne_resource_id: string;
  ltp_resource_id: string;
  resource_type: string;
  product_type: string;
  other_info?: string;
  impacted_resource?: string;
  trail_name?: string;
  fiber_name?: string;
  ason_obj_name?: string;
  created_on: Date;
  cleared_on?: Date;
  acknowledged_on?: Date;
  nceGponNetworkElement?: NceGponNetworkElement;
  alarm_filter_config_id?: number;
  is_cleared?: boolean;
  loc_info_frame?: string;
  loc_info_slot?: string;
  loc_info_subslot?: string;
  loc_info_port?: string;
  loc_info_onu_id?: string;
  loc_info_type_id?: string;
}
