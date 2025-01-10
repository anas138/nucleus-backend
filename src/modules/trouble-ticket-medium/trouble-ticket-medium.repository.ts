import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { TroubleTicketMedium } from 'src/entities/trouble-ticket-medium.entity';

@Injectable()
export class TroubleTicketMediumRepository extends BaseAbstractRepository<TroubleTicketMedium> {
  constructor(
    @InjectRepository(TroubleTicketMedium)
    private readonly troubleTicketMediumRepository: Repository<TroubleTicketMedium>,
  ) {
    super(troubleTicketMediumRepository);
  }
}
