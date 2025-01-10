import { FILTERS_TEMPLATES_TYPE } from 'src/common/enums/enums';
import { User } from 'src/entities/user.entity';

export class FetchFiltersTemplateModel {
  id: number;
  template_type: FILTERS_TEMPLATES_TYPE;
  name: string;
  comment: string;
  is_shared: boolean;
  filters_payload: string;
  users?: User[];
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class CreateFiltersTemplateModel {
  template_type: FILTERS_TEMPLATES_TYPE;
  name: string;
  comment?: string;
  is_shared?: boolean;
  filters_payload: string;
}
