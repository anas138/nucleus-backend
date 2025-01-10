import { Injectable } from '@nestjs/common';
import { FetchUserModel } from 'src/models/user.model';
import { TroubleTicketRepository } from '../trouble-ticket/trouble-ticket.repository';
import { APP_CONSTANTS, DashboardTrendTypes } from 'src/common/enums/enums';
import { GetTroubleTicketDashboardModel } from 'src/models/trouble-ticket-dashboard.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
const helperFunctionsService = new HelperFunctions();
@Injectable()
export class TroubleTicketDashboardService {
  constructor(
    private readonly troubleTicketRepository: TroubleTicketRepository,
  ) {}

  async getTroubleTicketStatusCountByDepartment(user: FetchUserModel) {
    const stats = await this.troubleTicketRepository.getStats(user);
    const transformedData = await this.transformStatData(stats, user);
    return transformedData;
  }

  async getTroubleTicketTrends(
    query: GetTroubleTicketDashboardModel,
    user: FetchUserModel,
  ) {
    const { trend_type } = query;

    //const trends = this.troubleTicketRepository.getTroubleTicketTrends(query)
    let trend: any;
    switch (trend_type) {
      case DashboardTrendTypes.ALARMS: {
        trend =
          await this.troubleTicketRepository.getTroubleTicketTrendsByAlarms(
            query,
            user,
          );
        break;
      }

      case DashboardTrendTypes.STATUS: {
        trend =
          await this.troubleTicketRepository.getTroubleTicketTrendsByStatus(
            query,
            user,
          );
        break;
      }

      case DashboardTrendTypes.REGION: {
        trend =
          await this.troubleTicketRepository.getTroubleTicketTrendsByRegion(
            query,
            user,
          );
        break;
      }

      case DashboardTrendTypes.SUB_DEPARTMENT: {
        trend = await this.troubleTicketRepository.getTicketBySubDepartment(
          query,
          user,
        );
        break;
      }

      case DashboardTrendTypes.NETWORK: {
        trend = await this.troubleTicketRepository.getTicketByNetwork(
          query,
          user,
        );
        break;
      }

      case DashboardTrendTypes.CATEGORY: {
        trend = await this.troubleTicketRepository.getTicketByCategory(
          query,
          user,
        );
        break;
      }
      case DashboardTrendTypes.PRIORITY: {
        trend = await this.troubleTicketRepository.getTicketByPriority(
          query,
          user,
        );
        break;
      }
    }

    const transformedTrend =
      helperFunctionsService.transformDataForDashboardView(
        trend,
        APP_CONSTANTS.DASHBOARD_STATS_FROMAT.BAR_CHART,
      );

    return transformedTrend;
  }

  async transformStatData(data: any, user: any) {
    let set = {};
    let ids = {};
    data.forEach((c: any) => (set[c.label] = 0));
    data.forEach((c: any) => {
      set[c.label] = +set[c.label] + +c.count;
      ids[c.label] = c.id;
    });

    const statsByDepartment = {
      stats: { ...set },
      subDepartment: {
        id: user.sub_department_id,
        name: user.sub_department.name,
      },
      ids,
    };

    return statsByDepartment;
  }
}
