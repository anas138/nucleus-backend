import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TroubleTicketService } from '../trouble-ticket/trouble-ticket.service';
import { AuthGuard } from '@nestjs/passport';
import { GetTroubleTicketDashboardDto } from 'src/dto/trouble-ticket-dashboard/get-trouble-ticket-dashboard.dto';
import { TroubleTicketDashboardService } from './troublre-ticket-dashboard.service';

@UseGuards(AuthGuard())
@Controller('trouble-ticket-dashboard')
export class TroubleTicketDashboardController {
  constructor(
    private readonly troubleTicketService: TroubleTicketService,
    private readonly troubleTicketDashboardService: TroubleTicketDashboardService,
  ) {}

  @Get('/trouble-ticket-count')
  async getTroubleTicketCountIp(@Req() req: any) {
    const { user } = req;
    return this.troubleTicketDashboardService.getTroubleTicketStatusCountByDepartment(
      user,
    );
  }

  @Get('/trend')
  async troubleTicketTransmissionTrends(
    @Query() query: GetTroubleTicketDashboardDto,
    @Req() req: any,
  ) {
    const { user } = req;
    return this.troubleTicketDashboardService.getTroubleTicketTrends(
      query,
      user,
    );
  }

  // @Get('/trend/ip')
  // async troubleTicketIpTrends(
  //   @Query() query: GetTroubleTicketDashboardDto,
  //   @Req() req: any,
  // ) {
  //   query = { ...query, type: 'OBSERVIUM' };
  //   const { user } = req;
  //   return this.troubleTicketDashboardService.getTroubleTicketTrends(
  //     query,
  //     user,
  //   );
  // }
}

// Tickets by alarm
// Tickets by devices
// Tickets by status
// Tickets by region
