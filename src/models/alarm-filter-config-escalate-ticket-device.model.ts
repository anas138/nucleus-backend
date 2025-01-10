import { RecordStatus } from 'src/common/enums/enums';

export class AlarmFilterCOnfigEscalateTickerDeviceModel {
  id?: number;

  alarm_filter_config_id: number;

  app_type?: string;

  nce_device_id?: string;

  obs_device_id?: number;

  nokia_device_id?: string;

  nce_gpon_device_id?: string;

  ldi_softswitch_trunk_group_id?: number;

  record_status?: RecordStatus;
}
