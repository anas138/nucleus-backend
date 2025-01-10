import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AlarmStatus, TrendType } from 'src/common/enums/enums';

class TrendsModel {
  trend_type: TrendType;
}
export class TrendsFilterConditionsModel {
  status?: AlarmStatus;
  from_date?: Date;
  to_date?: Date;
}

export class TransmissionTrendsFilterConditionsModel extends TrendsFilterConditionsModel {}

export class IpTrendsFilterConditionsModel extends TrendsFilterConditionsModel {}

export class widgetTrendsFilterConditionModel extends TrendsFilterConditionsModel {
  alarm_filter_config_id?: number;
}

export class TransmissionTrendsModel extends IntersectionType(
  TrendsModel,
  TransmissionTrendsFilterConditionsModel,
  widgetTrendsFilterConditionModel,
) {}

export class IpTrendsModel extends IntersectionType(
  TrendsModel,
  IpTrendsFilterConditionsModel,
  widgetTrendsFilterConditionModel,
) {}
