import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccumulatedTroubleTicket } from 'src/entities/accumulated-trouble-ticket.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class AccumulatedTroubleTicketRepository extends BaseAbstractRepository<AccumulatedTroubleTicket> {
  constructor(
    @InjectRepository(AccumulatedTroubleTicket)
    private readonly accumulatedTroubleTicketRepository: Repository<AccumulatedTroubleTicket>,
  ) {
    super(accumulatedTroubleTicketRepository);
  }

  async updateAccumulatedTicket(
    condition: FindOptionsWhere<AccumulatedTroubleTicket>,
    updateData: Partial<AccumulatedTroubleTicket>,
    entityManager: EntityManager,
  ) {
    return entityManager.update(
      AccumulatedTroubleTicket,
      condition,
      updateData,
    );
  }
}
