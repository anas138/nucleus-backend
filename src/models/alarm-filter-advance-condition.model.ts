import { AppType } from 'src/common/enums/enums';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { FetchAlarmFilterConfigModel } from './alarm-filter-config.model';

export class AlarmFilterAdvanceConditionModel {
  field_name: string;
  field_value: string;
  search_criteria: string;
  created_by?: number;
  updated_by?: number;
}
export class CreateALarmFilterAdvanceConditionModel extends AlarmFilterAdvanceConditionModel {
  alarm_filter_config_id?: number;
}

export class FetchAlarmFilterAdvanceConditionModel extends AlarmFilterAdvanceConditionModel {
  id: number;
  alarm_filter_config?: FetchAlarmFilterConfigModel;
}

export class UpdateAlarmFilterAdvanceConditionModel extends AlarmFilterAdvanceConditionModel {
  id?: number;
  alarm_filter_config_id?: number;
}
