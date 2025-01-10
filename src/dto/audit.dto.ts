import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class AuditDto {
  @IsOptional()
  @IsNumber()
  created_by?: number;

  @IsOptional()
  @IsNumber()
  updated_by?: number;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
