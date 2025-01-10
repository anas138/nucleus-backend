import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { AuditDto } from '../audit.dto';
import { Optional } from '@nestjs/common';
import { TicketEscalationDevice } from 'src/models/alarm-filter.model';

export class AlarmFilterTicketEscalationDto extends AuditDto {
  @IsNumber()
  ticket_escalation_initial_sub_department: number;

  @IsOptional()
  @IsNumber()
  ticket_escalation_medium: number;

  @IsBoolean()
  can_revert_ticket_on_alarm_recovery: boolean;

  @IsNumber()
  ticket_escalation_category: number;

  @IsOptional()
  @IsNumber()
  ticket_escalation_sub_category: number;

  @Optional()
  ticket_escalation_device: string[] | number[];
}
