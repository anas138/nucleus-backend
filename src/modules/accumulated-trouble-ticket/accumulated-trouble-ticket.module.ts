import { Module } from '@nestjs/common';
import { AccumulatedTroubleTicketController } from './accumulated-trouble-ticket.controller';
import { AccumulatedTroubleTicketRepository } from './accumulated-trouble-ticket.repository';
import { AccumulatedTroubleTicketService } from './accumulated-trouble-ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccumulatedTroubleTicket } from 'src/entities/accumulated-trouble-ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccumulatedTroubleTicket])],
  controllers: [AccumulatedTroubleTicketController],
  providers: [
    AccumulatedTroubleTicketService,
    AccumulatedTroubleTicketRepository,
  ],
  exports: [
    AccumulatedTroubleTicketService,
    AccumulatedTroubleTicketRepository,
  ],
})
export class AccumulatedTroubleTicketModule {}
