import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserRoleDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'User ID cannot be other than number',
  })
  userId: number;
}
