import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuditDto } from '../audit.dto';

export class CreateSubDepartmentDto extends AuditDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  department_id: number;
}
