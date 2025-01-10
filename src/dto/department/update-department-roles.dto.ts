import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDepartmentRolesDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
