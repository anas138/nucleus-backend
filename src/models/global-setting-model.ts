export class GlobalSettingsModel {
  global_setting_type_id?: number;
  condition_value?: string;
  key?: string;
  value_datatype?: string;
  record_status?: string;
  sequence?: number;
  value?: any;
}

export class GlobalSettingsQueryModel {
  global_setting_type_id: number;
  condition_value: string;
  key: string;
}
