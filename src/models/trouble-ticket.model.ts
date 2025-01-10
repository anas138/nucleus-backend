import { EscalationLevel, RecordStatus } from '../common/enums/enums';
import { PaginationQueryModel } from './pagination.model';
import { AlarmFilterConfigModel } from './alarm-filter-config.model';
import { User } from 'src/entities/user.entity';
import { TroubleTicketCategoryModel } from './trouble-ticket-category.model';
import { TroubleTicketMediumModule } from 'src/modules/trouble-ticket-medium/trouble-ticket-medium.module';
import { DepartmentCreatedModel } from './department.model';
import {
  FetchSubDepartmentModel,
  SubDepartmentCreatedModel,
} from './sub-department.model';
import { DropDownItem } from 'src/entities/drop-down-item.entity';
import { TroubleTicketPause } from 'src/entities/trouble-ticket-pause.entity';
import { AccumulatedTroubleTicket } from 'src/entities/accumulated-trouble-ticket.entity';

export class TroubleTicketModel {
  id?: number;
  name?: string;
  ticket_number?: string;
  case_title?: string;
  description?: string;
  alarm_id: number;
  alarm_config_id: number;
  app_type?: string;
  tat_uom?: string;
  network_type?: string;
  trouble_ticket_category_id?: number;
  trouble_ticket_sub_category_id?: number;
  medium?: number;
  status?: number;
  is_assigned?: boolean;
  assigned_to_id?: number;
  assigned_from_id?: number;
  esclationLevel?: EscalationLevel;
  esclation_role_id?: number;
  total_tat?: number;
  tat_start_time?: Date;
  tat_end_time?: Date;
  department_id?: number;
  sub_department_id?: number;
  record_status?: RecordStatus;
  created_by?: number;
  attachment?: any;
  message?: string;
  message_title?: string;
  completed_time?: string;
  resolved_time?: string;
  resolved_Date_Time?: Date;
  completed_Date_Time?: Date;
  resolved_by_sub_department?: number;
  ticket_generation_type?: number;
  alarm_config_can_revert?: boolean;
  alarm_config_escalation_delay?: number;
  updated_by?: number;
  is_rca_required?: boolean;
  rca_submitted?: boolean;
  region_id?: number;
  priority_level?: number;
  is_rca_awaited?: boolean;
  over_tat?: boolean;
}

export class PermissionModel {
  can_leave_ticket: boolean;
  can_update_ticket: boolean;
  can_reopen_ticket: boolean;
  can_complete_ticket: boolean;
  can_request_ticket_pause: boolean;
  can_resolve_ticket: boolean;
  can_pull: boolean;
  can_assign_ticket: boolean;
  can_sent_back: boolean;
  can_cancel: boolean;
  can_request_rca: boolean;
  can_submit_rca: boolean;
  can_pause: boolean;
  can_resume: boolean;
  can_approve_pause: boolean;
  can_cancel_pause: boolean;
  can_change_priority: boolean;
}

export class ReturnTroubleTicketModel extends TroubleTicketModel {
  created_by?: number;
  updated_by?: number;
  alarm_detail: any;
  troubleTicketMedium?: TroubleTicketMediumModule;
  troubleTicketCategory?: TroubleTicketCategoryModel;
  troubleTicketSubCategory?: TroubleTicketCategoryModel;
  currentStatus: DropDownItem;
  department?: DepartmentCreatedModel;
  subDepartment?: FetchSubDepartmentModel;
  alarmFilterConfig?: AlarmFilterConfigModel;
  assignedToUser?: User;
  assignedFromUser?: User;
  permissions?: PermissionModel;
  troubleTicketPause?: any[];
  currentTicketPause?: TroubleTicketPause;
  outageAlarms: any[];
  createdByUser?: User;
  priorityLevel?: DropDownItem;
}

export class TroubleTicketActionModel {
  id?: number;
  assigned_to_id?: number;
  status?: number;
  comment?: string;
  attachment?: any;
  updated_by?: number;
  trouble_ticket_category_id?: number;
  trouble_ticket_sub_category_id?: number;
  department_id?: number;
  sub_department_id?: number;
  assigned_from_id?: number;
  tat_start_time?: Date;
  tat_end_time?: Date;
  total_tat?: number;
  tat_uom?: any;
  app_type?: string;
  message?: string;
  message_title?: string;
  completed_time?: string;
  resolved_time?: string;
  resolved_Date_Time?: Date;
  completed_Date_Time?: Date;
  resolved_by_sub_department?: number;
  ticket_generation_type?: number;
  alarm_config_can_revert?: boolean;
  alarm_config_escalation_delay?: number;
  is_assigned?: boolean;
  resolution_reason?: number;
  resolution_comment?: string;
  is_rca_required?: boolean;
  region_id?: number;
  rca?: TroubleTicketRcaModel;
  is_rca_awaited?: boolean;
  priority_level?: number;
  esclationLevel?: EscalationLevel;
  over_tat?: boolean;
}

export class TroubleTicketFilterModel extends PaginationQueryModel {
  openTicket?: boolean;
  closeTicket: boolean;
  status?: any;
  medium?: number;
  category?: number;
  subDepartment?: number;
  searchColumn?: string;
  toDate?: Date;
  fromDate?: Date;
  statusColumn?: any;
  pauseRequest?: boolean;
  appType?: string;
  rcaRequired?: boolean;
  isOutageOccurred?: string;
  ticket_generation_type?: number;
  priorityLevel?: number;
  overTat?: string;
  alarmFilterConfigIds?: string;
  networkType?: string;
}

export class UpdateTroubleTicketModel {
  comment?: string;
  attachment?: any;
  status?: number;
  updated_by?: number;
  assigned_to_id?: number;
  sub_department_id?: number;
}

export class TroubleTicketRcaModel {
  rca_reason: string;
  corrective_action: string;
  preventive_step: string;
  rca_start_time: Date;
  rca_end_time: Date;
  created_by: number;
  comment?: string;
  attachment?: string;
}

export class TroubleTicketPauseModel {
  id: number;
  pause_start_time: Date;
  pause_end_time: Date;
  pause_reason: string;
  created_by?: number;
  comment?: string;
  attachment?: any;
}

export class TroubleTicketLogsModel {
  status?: number;
  comment?: string;
  attachment?: any;
  updated_by: number;
}

export class BulkUpdateModel {
  ids: number[];
  status: number;
  comment: string;
  resolution_reason?: number;
  resolution_comment?: string;
  created_by: number;
}
