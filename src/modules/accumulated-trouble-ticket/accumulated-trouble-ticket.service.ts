import { BaseService } from 'src/common/services/base.service';
import { AccumulatedTroubleTicket } from 'src/entities/accumulated-trouble-ticket.entity';
import { AccumulatedTroubleTicketRepository } from './accumulated-trouble-ticket.repository';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, FindOptionsWhere } from 'typeorm';

@Injectable()
export class AccumulatedTroubleTicketService extends BaseService<AccumulatedTroubleTicket> {
  constructor(
    private readonly accumulateTroubleTicketRepository: AccumulatedTroubleTicketRepository,
  ) {
    super(accumulateTroubleTicketRepository);
  }

  async updateWithTransactionScope(
    id: FindOptionsWhere<AccumulatedTroubleTicket>,
    data: Partial<AccumulatedTroubleTicket>,
    entityManager: EntityManager,
  ): Promise<any> {
    return this.accumulateTroubleTicketRepository.updateAccumulatedTicket(
      id,
      data,
      entityManager,
    );
  }
}
