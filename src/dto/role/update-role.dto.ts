import {
    IsNotEmpty,
    IsString,
    MaxLength,
  } from 'class-validator';
  import { AuditDto } from '../audit.dto';
  
  export class UpdateRoleDto extends AuditDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;
  
  }
  