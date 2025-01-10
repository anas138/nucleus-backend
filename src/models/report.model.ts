import { PaginationQueryModel } from './pagination.model';

export class ReportModel extends PaginationQueryModel {
  toDate: string;
  fromDate: string;
  appType?: any;
  status?: number;
  category?: number;
  subDepartment?: number;
  medium?: number;
  search?: string;
  ticketGenerationType?: number;
  resolveBySubDepartment?: number;
  rcaSubmitted?: string;
  columns?: any[];
  networkType?: string;
}
