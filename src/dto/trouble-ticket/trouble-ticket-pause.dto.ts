import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
export class TroubleTicketPauseDto {
  @IsNumber()
  id: number;

  @IsDate()
  pause_start_time: Date;

  @IsDate()
  pause_end_time: Date;

  @IsString()
  pause_reason: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  attachment: any;
}
