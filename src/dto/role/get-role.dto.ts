import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetRoleDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'Permission ID cannot be other than number',
  })
  roleId: number;
}
