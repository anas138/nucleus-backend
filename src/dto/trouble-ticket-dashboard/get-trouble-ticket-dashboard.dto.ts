import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DashboardTrendTypes } from 'src/common/enums/enums';

export class GetTroubleTicketDashboardDto {
  @IsNotEmpty()
  @IsEnum(DashboardTrendTypes)
  trend_type: DashboardTrendTypes;

  @IsOptional()
  @IsString()
  from_date: string;

  @IsOptional()
  @IsString()
  to_date: string;

  @IsOptional()
  @IsString()
  type: string;
}
