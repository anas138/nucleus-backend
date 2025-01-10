import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTroubleTicketPauseDto {
  @IsNotEmpty()
  @IsNumber()
  ticketId: number;

  @IsOptional()
  @IsDate()
  pause_end_time: Date;

  @IsOptional()
  @IsDate()
  pause_start_time: Date;

  @IsOptional()
  @IsNumber()
  updated_by: number;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  attachment: any;
}
