import { DashboardTrendTypes } from 'src/common/enums/enums';

export class GetTroubleTicketDashboardModel {
  trend_type: DashboardTrendTypes;
  from_date: string;
  to_date: string;
}
