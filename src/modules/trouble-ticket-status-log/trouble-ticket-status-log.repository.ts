import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { TroubleTicketStatusLog } from 'src/entities/trouble-ticket-status-log.entity';

@Injectable()
export class TroubleTicketStatusLogRepository extends BaseAbstractRepository<TroubleTicketStatusLog> {
  constructor(
    @InjectRepository(TroubleTicketStatusLog)
    private readonly troubleTicketStatusLogRepository: Repository<TroubleTicketStatusLog>,
  ) {
    super(troubleTicketStatusLogRepository);
  }
}
