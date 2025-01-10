import { RecordStatus } from 'src/common/enums/enums';

export class CreateTroubleTicketPauseModel {
  trouble_ticket_id: number;
  pause_start_time: Date;
  pause_end_time: Date;
  pause_reason: string;
  is_approved: boolean;
  approved_by?: number;
  paused_by: number;
  total_paused_duration?: number;
  sub_department_id: number;
  comment?: string;
  created_by: number;
}

export class UpdateTroubleTicketPauseModel {
  ticketId?: number;
  pause_end_time?: Date;
  pause_start_time?: Date;
  updated_by: number;
  comment?: string;
  attachment?: any;
}
