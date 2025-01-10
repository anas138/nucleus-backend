import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { TroubleTicketAssigned } from 'src/entities/trouble-ticket-assigned.entity';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { DropDownItem } from 'src/entities/drop-down-item.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TroubleTicketAssignedRepository extends BaseAbstractRepository<TroubleTicketAssigned> {
  constructor(
    @InjectRepository(TroubleTicketAssigned)
    private readonly troubleTicketAssignedRepository: Repository<TroubleTicketAssigned>,
  ) {
    super(troubleTicketAssignedRepository);
  }
}
