import { ArrayNotEmpty, IsArray, IsNumber, Matches } from 'class-validator';

export class CreateRolePermissionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}
