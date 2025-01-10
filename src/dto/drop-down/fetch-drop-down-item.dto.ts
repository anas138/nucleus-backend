import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FetchDropDownItemsDto {
  @IsOptional()
  @IsString()
  category_constant: string;

  @IsOptional()
  @IsNumber()
  category_id: number;
}
