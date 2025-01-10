import { IsEnum, IsNotEmpty} from 'class-validator';
import { FILTERS_TEMPLATES_TYPE } from 'src/common/enums/enums';

export class FiltersTemplateGetAllQueryParams {
  @IsNotEmpty()
  @IsEnum(FILTERS_TEMPLATES_TYPE)
  template_type: FILTERS_TEMPLATES_TYPE;
}
