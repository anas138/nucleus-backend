import { RecordStatus } from 'src/common/enums/enums';

export class TroubleTicketStatusLogModel {
  id?: number;
  trouble_ticket_id: number;
  status: number;
  record_status: RecordStatus;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
}
