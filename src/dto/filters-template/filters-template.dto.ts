import { FILTERS_TEMPLATES_TYPE } from 'src/common/enums/enums';
import { AuditDto } from '../audit.dto';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class FiltersTemplateDto extends AuditDto {
  @IsNotEmpty()
  @IsEnum(FILTERS_TEMPLATES_TYPE)
  template_type: FILTERS_TEMPLATES_TYPE;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  is_shared: boolean;

  @IsNotEmpty()
  @IsString()
  filters_payload: string;
}
