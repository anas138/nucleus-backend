import { Module } from '@nestjs/common';
import { TroubleTicketDashboardController } from './troublre-ticket-dashboard.controller';
import { TroubleTicketDashboardService } from './troublre-ticket-dashboard.service';

import { TroubleTicketModule } from '../trouble-ticket/trouble-ticket.module';

@Module({
  imports: [TroubleTicketModule],
  controllers: [TroubleTicketDashboardController],
  providers: [TroubleTicketDashboardService],
  exports: [TroubleTicketDashboardService],
})
export class TroubleTicketDashboardModule {}
