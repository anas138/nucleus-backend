import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Order } from 'src/common/enums/enums';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  limit: number;

  @IsNumber()
  @IsPositive()
  page: number;

  @IsOptional()
  @IsString()
  search?: string;

  [key: string]: any;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(Order)
  orderDirection?: Order;
}
