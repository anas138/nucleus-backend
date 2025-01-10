import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AuditDto } from '../audit.dto';

export class UpdateDesignationtDto extends AuditDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
}
