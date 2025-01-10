import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TroubleTicketModule } from '../trouble-ticket/trouble-ticket.module';
@Module({
  imports: [TroubleTicketModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
