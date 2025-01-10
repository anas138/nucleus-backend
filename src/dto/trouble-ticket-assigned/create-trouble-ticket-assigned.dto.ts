import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
} from 'class-validator';

export class CreateTroubleTicketAssignedDto {
  @IsNumber()
  trouble_ticket_id: number;

  @IsNumber()
  assigned_to_id: number;

  @IsNumber()
  assigned_from_id: number;

  @IsNumber()
  from_sub_department_id: number;

  @IsNumber()
  to_sub_department_id: number;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  created_by?: number;

  @IsOptional()
  @IsNumber()
  updated_by?: number;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
