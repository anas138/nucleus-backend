import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TroubleTicketRcaDto {
  @IsNotEmpty()
  @IsString()
  rca_reason: string;

  @IsNotEmpty()
  @IsString()
  corrective_action: string;

  @IsNotEmpty()
  @IsString()
  preventive_step: string;

  @IsNotEmpty()
  @IsDate()
  rca_start_time: Date;

  @IsNotEmpty()
  @IsDate()
  rca_end_time: Date;

  @IsNumber()
  created_by: number;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  attachment: any;
}
