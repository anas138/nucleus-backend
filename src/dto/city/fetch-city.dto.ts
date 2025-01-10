import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FetchCityDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  country_id?: number;

  @IsOptional()
  @IsNumber()
  province_id?: number;

  @IsOptional()
  @IsNumber()
  region_id?: number;
}
