import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { RecordStatus } from 'src/common/enums/enums';

export class CreateTroubleTicketPauseDto {
  @IsNumber()
  trouble_ticket_id: number;

  @IsDate()
  pause_start_time: Date;

  @IsDate()
  pause_end_time: Date;

  @IsString()
  pause_reason: string;

  @IsBoolean()
  is_approved: boolean;

  @IsNumber()
  approved_by: number;

  @IsNumber()
  paused_by: number;

  @IsNumber()
  total_paused_duration: number;

  @IsNumber()
  sub_department_id: number;

  @IsEnum(RecordStatus)
  record_status: RecordStatus;
}
