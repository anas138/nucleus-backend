import { AlarmFilterAdvanceConditionDto } from './alarm-filter-advance-condition.dto';
import {
  AlarmFilterConfigDto,
  ConditionalFieldsValidator,
} from './alarm-filter-config.dto';
import { AlarmRecipientDto } from './alarm-recipient.dto';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsArrayUniqueConstraint } from 'src/common/custom-validators/unique-array.validator';
import { AuditDto } from '../audit.dto';
import { AlarmFilterTicketEscalationDto } from './alarm-filter-escalation-ticket.dto';
export class UpdateAlarmFilterConfigDto extends AlarmFilterConfigDto {}
export class UpdateAlarmFilterAdvanceConditionDto extends AlarmFilterAdvanceConditionDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  id: number;
}
export class UpdateAlarmRecipientDto extends AlarmRecipientDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  id: number;
}

export class UpdateAlarmFilterDto extends AuditDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateAlarmFilterConfigDto)
  alarm_filter_config: UpdateAlarmFilterConfigDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAlarmFilterAdvanceConditionDto)
  @Validate(IsArrayUniqueConstraint)
  alarm_filter_advanced_conditions: UpdateAlarmFilterAdvanceConditionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAlarmRecipientDto)
  @Validate(IsArrayUniqueConstraint)
  alarm_recipients: UpdateAlarmRecipientDto[];

  @IsOptional()
  @ValidateNested()
  escalation_ticket: AlarmFilterTicketEscalationDto;

  @IsOptional()
  @IsBoolean()
  @ConditionalFieldsValidator({
    message:
      'Validation Error',
  })
  is_change_in_display_severity: boolean;

  @IsOptional()
  @IsString()
  conditional_severity: string;

  @IsOptional()
  @IsString()
  severity_to_be_displayed: string;
}

export function transformUpdateAlarmFilterDto(
  updateAlarmFilterDto: UpdateAlarmFilterDto,
) {
  let transformedUpdateAlarmFilterDto: UpdateAlarmFilterDto = {
    ...updateAlarmFilterDto,
  };

  transformedUpdateAlarmFilterDto.alarm_filter_config.updated_by =
    updateAlarmFilterDto.updated_by;
  transformedUpdateAlarmFilterDto.alarm_filter_config.updated_at =
    updateAlarmFilterDto.updated_at;

  if (updateAlarmFilterDto.alarm_filter_advanced_conditions) {
    transformedUpdateAlarmFilterDto.alarm_filter_advanced_conditions =
      updateAlarmFilterDto.alarm_filter_advanced_conditions.map((cond) => {
        return {
          ...cond,
          updated_by: updateAlarmFilterDto.updated_by,
          updated_at: updateAlarmFilterDto.updated_at,
        };
      });
  }

  if (updateAlarmFilterDto.alarm_recipients) {
    transformedUpdateAlarmFilterDto.alarm_recipients =
      updateAlarmFilterDto.alarm_recipients.map((recipient) => {
        return {
          ...recipient,
          updated_by: updateAlarmFilterDto.updated_by,
          updated_at: updateAlarmFilterDto.updated_at,
        };
      });
  }
  if (updateAlarmFilterDto.escalation_ticket) {
    transformedUpdateAlarmFilterDto.escalation_ticket = {
      ...updateAlarmFilterDto.escalation_ticket,
    };
  }
  return transformedUpdateAlarmFilterDto;
}
