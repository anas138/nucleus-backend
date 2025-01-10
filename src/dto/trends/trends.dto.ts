import { IntersectionType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { AlarmStatus, TrendType } from 'src/common/enums/enums';

class TrendsDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(TrendType)
  trend_type: TrendType;
}
class TrendsFilterConditionsDTO {
  @IsOptional()
  @IsEnum(AlarmStatus)
  status: AlarmStatus;

  @IsOptional()
  @IsDate({ message: 'Invalid date format' })
  @Type(() => Date)
  from_date?: Date;

  @IsOptional()
  @IsDate({ message: 'Invalid date format' })
  @Type(() => Date)
  to_date?: Date;

  @IsOptional()
  @IsNumber()
  alarm_filter_config_id?: number;
}

export class TransmissionTrendsFilterConditionsDTO extends TrendsFilterConditionsDTO {}

export class IpTrendsFilterConditionsDTO extends TrendsFilterConditionsDTO {}

export class TransmissionTrendsDTO extends IntersectionType(
  TrendsDTO,
  TransmissionTrendsFilterConditionsDTO,
) {}

export class IpTrendsDTO extends IntersectionType(
  TrendsDTO,
  IpTrendsFilterConditionsDTO,
) {}
