import { AlarmFilterAdvanceConditionDto } from './alarm-filter-advance-condition.dto';
import { AlarmFilterConfigDto } from './alarm-filter-config.dto';
import { AlarmRecipientDto } from './alarm-recipient.dto';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsArrayUniqueConstraint } from 'src/common/custom-validators/unique-array.validator';
import { AuditDto } from '../audit.dto';
import { AlarmFilterTicketEscalationDto } from './alarm-filter-escalation-ticket.dto';

export class CreateAlarmFilterConfigDto extends AlarmFilterConfigDto {}
export class CreateAlarmFilterAdvanceConditionDto extends AlarmFilterAdvanceConditionDto {}
export class CreateAlarmRecipientDto extends AlarmRecipientDto {}

export class CreateAlarmFilterDto extends AuditDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAlarmFilterConfigDto)
  alarm_filter_config: CreateAlarmFilterConfigDto;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateAlarmFilterAdvanceConditionDto)
  @Validate(IsArrayUniqueConstraint)
  alarm_filter_advanced_conditions: CreateAlarmFilterAdvanceConditionDto[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateAlarmRecipientDto)
  @Validate(IsArrayUniqueConstraint)
  alarm_recipients: CreateAlarmRecipientDto[];

  @IsOptional()
  @ValidateNested()
  escalation_ticket: AlarmFilterTicketEscalationDto;
}

export function transformCreateAlarmFilterDto(
  createAlarmFilterDto: CreateAlarmFilterDto,
) {
  let transformedCreateAlarmFilterDto: CreateAlarmFilterDto = {
    ...createAlarmFilterDto,
  };

  transformedCreateAlarmFilterDto.alarm_filter_config.created_by =
    createAlarmFilterDto.created_by;

  transformedCreateAlarmFilterDto.alarm_filter_config.updated_by =
    createAlarmFilterDto.created_by;

  if (transformedCreateAlarmFilterDto.alarm_filter_advanced_conditions) {
    transformedCreateAlarmFilterDto.alarm_filter_advanced_conditions =
      createAlarmFilterDto.alarm_filter_advanced_conditions.map((cond) => {
        return {
          ...cond,
          created_by: createAlarmFilterDto.created_by,
          updated_by: createAlarmFilterDto.created_by,
        };
      });
  }

  if (transformedCreateAlarmFilterDto.alarm_recipients) {
    transformedCreateAlarmFilterDto.alarm_recipients =
      createAlarmFilterDto.alarm_recipients.map((recipient) => {
        return {
          ...recipient,
          created_by: createAlarmFilterDto.created_by,
          updated_by: createAlarmFilterDto.created_by,
        };
      });
  }
  return transformedCreateAlarmFilterDto;
}
