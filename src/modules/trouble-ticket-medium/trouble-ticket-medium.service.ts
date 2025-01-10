import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { TroubleTicketMedium } from 'src/entities/trouble-ticket-medium.entity';
import { TroubleTicketMediumRepository } from './trouble-ticket-medium.repository';

@Injectable()
export class TroubleTicketMediumService extends BaseService<TroubleTicketMedium> {
  constructor(
    private readonly troubleTicketMediumRepository: TroubleTicketMediumRepository,
  ) {
    super(troubleTicketMediumRepository);
  }
}
