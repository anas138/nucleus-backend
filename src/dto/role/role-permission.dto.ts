import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RolePermissionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'Role ID cannot be other than number',
  })
  roleId: number;
}
