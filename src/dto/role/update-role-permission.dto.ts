import {IsArray, IsNumber } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}
