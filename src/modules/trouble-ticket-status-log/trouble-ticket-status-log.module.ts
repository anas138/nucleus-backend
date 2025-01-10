import { Module } from '@nestjs/common';
import { TroubleTicketStatusLogRepository } from './trouble-ticket-status-log.repository';
import { TroubleTicketStatusLogService } from './trouble-ticket-status-log.service';
import { TroubleTicketStatusLogController } from './trouble-ticket-status-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TroubleTicketStatusLog } from 'src/entities/trouble-ticket-status-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TroubleTicketStatusLog])],
  controllers: [TroubleTicketStatusLogController],
  providers: [TroubleTicketStatusLogService, TroubleTicketStatusLogRepository],
  exports: [TroubleTicketStatusLogService, TroubleTicketStatusLogRepository],
})
export class TroubleTicketStatusLogModule {}
