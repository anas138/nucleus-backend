import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBulkTroubleTicketDto {
  @IsArray()
  ids: number[];

  @IsNumber()
  status: number;

  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  resolution_reason?: number;

  @IsOptional()
  @IsString()
  resolution_comment?: string;

  @IsOptional()
  @IsNumber()
  created_by: number;
}
