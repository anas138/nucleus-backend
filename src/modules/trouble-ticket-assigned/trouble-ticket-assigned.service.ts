import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { TroubleTicketAssigned } from 'src/entities/trouble-ticket-assigned.entity';
import { TroubleTicketAssignedRepository } from './trouble-ticket-assigned.repository';
import { QueryRunner } from 'typeorm';
import {
  ReturnTroubleTicketModel,
  TroubleTicketActionModel,
  TroubleTicketModel,
} from 'src/models/trouble-ticket.model';
import { FetchUserModel } from 'src/models/user.model';
import {
  APP_CONSTANTS,
  DROPDOWN_ITEM_IDS,
  TroubleTicketStatus,
} from 'src/common/enums/enums';
import { UserService } from '../user/user.service';
import { SubDepartmentService } from '../sub-department/sub-department.service';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
@Injectable()
export class TroubleTicketAssignedService extends BaseService<TroubleTicketAssigned> {
  constructor(
    private readonly troubleTicketAssignedRepository: TroubleTicketAssignedRepository,
    private readonly userService: UserService,
    private readonly subDepartmentService: SubDepartmentService,
  ) {
    super(troubleTicketAssignedRepository);
  }

  async createAssignedUser(
    troubleTicketId: number,
    updated_by: number,
    assignedToUser: number,
    subDepartmentId: number,
    queryRunner: QueryRunner,
  ) {
    let updatePayload: TroubleTicketActionModel = null;
    const fromUser = await this.userService.getUserById(updated_by);

    const assignedTroubleTicketPayload = {
      trouble_ticket_id: troubleTicketId,
      assigned_to_id: assignedToUser,
      assigned_from_id: updated_by,
      to_sub_department_id: subDepartmentId,
      from_sub_department_id: fromUser.sub_department_id,
      created_by: updated_by,
    };

    await this.create(assignedTroubleTicketPayload, queryRunner.manager);
    return updatePayload;
  }
}
