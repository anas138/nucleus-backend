import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TroubleTicketCategory } from 'src/entities/trouble-ticket-catagory.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class TroubleTicketCategoryRepository extends BaseAbstractRepository<TroubleTicketCategory> {
  constructor(
    @InjectRepository(TroubleTicketCategory)
    private readonly troubleTicketCategoryRepository: Repository<TroubleTicketCategory>,
  ) {
    super(troubleTicketCategoryRepository);
  }
}
