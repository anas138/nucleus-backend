import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TroubleTicketPause } from 'src/entities/trouble-ticket-pause.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class TroubleTicketPauseRepository extends BaseAbstractRepository<TroubleTicketPause> {
  constructor(
    @InjectRepository(TroubleTicketPause)
    private readonly troubleTicketPauseRepository: Repository<TroubleTicketPause>,
  ) {
    super(troubleTicketPauseRepository);
  }
  async getTotalPauseTimeByTicket(ticketId: number, pauseId: number) {
    return this.troubleTicketPauseRepository.sum('total_paused_duration', {
      trouble_ticket_id: ticketId,
      id: pauseId,
    });
  }
}
