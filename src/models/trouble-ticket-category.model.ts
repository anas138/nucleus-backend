import { RecordStatus } from 'src/common/enums/enums';

export class TroubleTicketCategoryModel {
  id: number;
  name: string;
  description: string;
  tat?: number;
  tat_uom?: string;
  parent_id?: number | null;
  record_status?: RecordStatus;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: Date;
  updated_at?: Date;
}
