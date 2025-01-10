import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AuditDto } from '../audit.dto';

export class UpdateDepartmentDto extends AuditDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
}
