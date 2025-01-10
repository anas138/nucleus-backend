import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuditDto } from '../audit.dto';

export class CreateRegionDto extends AuditDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  description: string;
}
