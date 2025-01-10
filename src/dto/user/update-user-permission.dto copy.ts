import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { AuditDto } from '../audit.dto';

export class UpdateUserPermissionsDto extends AuditDto {
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}
