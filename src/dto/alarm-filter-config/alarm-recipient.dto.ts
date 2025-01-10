import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { AlarmRecipientType } from 'src/common/enums/enums';
import { AuditDto } from '../audit.dto';

export class AlarmRecipientDto extends AuditDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  recipient_type: string;

  @IsNotEmpty()
  @IsEnum(AlarmRecipientType)
  recipient: AlarmRecipientType;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  recipient_id: number;
}
