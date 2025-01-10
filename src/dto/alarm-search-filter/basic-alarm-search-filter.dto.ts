import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AlarmStatus } from 'src/common/enums/enums';

export class BasicAlarmSearchFilterDto {
  @IsOptional()
  @IsString()
  alarmName: string;

  @IsOptional()
  @IsString()
  severity: string;

  @IsOptional()
  @IsEnum(AlarmStatus)
  alarmStatus: AlarmStatus;

  @IsOptional()
  @IsString()
  devices: string;

  @IsOptional()
  @IsDate()
  lastOccurredFrom: Date;

  @IsOptional()
  @IsDate()
  lastOccurredTo: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  alarmFilterConfigId: number;

  @IsOptional()
  @IsString()
  entity_name: string;
}
