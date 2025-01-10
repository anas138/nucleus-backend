import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from '../pagination.dto';
import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TroubleTicketFilterDto extends IntersectionType(PaginationDto) {
  @IsOptional()
  status: any;

  @IsOptional()
  @IsBoolean()
  openTicket: boolean;

  @IsOptional()
  @IsBoolean()
  closeTicket: boolean;

  @IsOptional()
  @IsNumber()
  medium: number;

  @IsOptional()
  @IsNumber()
  category: number;

  @IsOptional()
  @IsNumber()
  subDepartment: number;

  @IsOptional()
  @IsString()
  searchColumn: string;

  @IsOptional()
  @IsDate()
  toDate: Date;

  @IsOptional()
  @IsDate()
  fromDate: Date;

  @IsOptional()
  @IsString()
  isOutageOccurred: string;

  @IsOptional()
  @IsNumber()
  ticket_generation_type: number;

  @IsOptional()
  @IsString()
  networkType: string;
}
