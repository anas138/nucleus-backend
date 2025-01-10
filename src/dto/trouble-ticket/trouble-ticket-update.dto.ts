import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class TroubleTicketUpdateStatusDto {
  @IsOptional()
  @IsNumber()
  status: number;

  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  trouble_ticket_category_id: number;

  @IsOptional()
  @IsNumber()
  trouble_ticket_sub_category_id: number;

  @IsOptional()
  attachment: any;

  @IsOptional()
  @IsNumber()
  updated_by: number;

  @IsOptional()
  @IsBoolean()
  is_rca_awaited: boolean;
}
