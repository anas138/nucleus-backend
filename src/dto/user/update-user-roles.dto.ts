import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { AuditDto } from '../audit.dto';

export class UpdateUserRolesDto extends AuditDto {
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
