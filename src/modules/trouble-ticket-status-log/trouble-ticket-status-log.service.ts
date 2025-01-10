import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { TroubleTicketStatusLog } from 'src/entities/trouble-ticket-status-log.entity';
import { TroubleTicketStatusLogRepository } from './trouble-ticket-status-log.repository';
import { FindManyOptions } from 'typeorm';
@Injectable()
export class TroubleTicketStatusLogService extends BaseService<TroubleTicketStatusLog> {
  constructor(
    private readonly troubleTicketStatusLogRepository: TroubleTicketStatusLogRepository,
  ) {
    super(troubleTicketStatusLogRepository);
  }
  async getStatusById(id: number) {
    const where: FindManyOptions<TroubleTicketStatusLog> = {
      where: {
        trouble_ticket_id: id,
      },
      relations: ['statusLog', 'troubleTicket'],
    };
    return this.findAll(where);
  }
}
