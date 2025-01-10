import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { TroubleTicketRepository } from './trouble-ticket.repository';
import { In, Not } from 'typeorm';
import {
  APP_MESSAGES,
  DROPDOWN_ITEM_IDS,
  EscalationLevel,
  MapTroubleTicketPriorityToPermissionOverTAT,
  UserType,
} from 'src/common/enums/enums';
import { TroubleTicketActionModel } from 'src/models/trouble-ticket.model';
import { TroubleTicketEventHandleService } from './trouble-ticket-event-handle.service';
import { UserService } from '../user/user.service';
import { TroubleTicketService } from './trouble-ticket.service';
import { sprintf } from 'sprintf-js';

@Injectable()
export class TroubleTicketHelperService extends BaseService<TroubleTicket> {
  constructor(
    private readonly repo: TroubleTicketRepository,
    private readonly troubleTicketEventHandleService: TroubleTicketEventHandleService,
    private readonly userService: UserService,
    private readonly troubleTicketService: TroubleTicketService,
  ) {
    super(repo);
  }

  async overTatTicket(ticketId: number, updatedBy: number) {
    const status = [
      DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED,
      DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED,
      DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
      DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RCA_AWAITED,
    ];
    const ticket = await this.troubleTicketService.getTroubleTicketById(
      ticketId,
      {
        status: Not(In([...status])),
      },
    );
    if (!ticket) {
      return 'Tat is not violated';
    }

    const groupUser = await this.userService.findGroupUserBySubDepartment(
      ticket.subDepartment,
      ticket.region_id ? [ticket.region_id] : null,
    );

    const systemUser = await this.userService.getByCondition({
      user_type: UserType.SYSTEM_USER,
    });

    const updateBody: TroubleTicketActionModel = {
      esclationLevel: EscalationLevel.L1,
      over_tat: true,
      message: sprintf(
        APP_MESSAGES.TROUBLE_TICKET_MESSAGE.OVER_TAT.MESSAGE,
        `${ticket.ticket_number}`,
      ),
      message_title: APP_MESSAGES.TROUBLE_TICKET_MESSAGE.OVER_TAT.Title,
      assigned_to_id: groupUser.id,
      is_assigned: false,
      assigned_from_id: systemUser.id,
    };
    await this.update({ id: ticket.id }, { ...updateBody });

    /// sent OverTat email
    const permission =
      MapTroubleTicketPriorityToPermissionOverTAT[ticket.priority_level];
    const title = sprintf(
      APP_MESSAGES.TROUBLE_TICKET_MESSAGE.OVER_TAT.EMAIL.title,
      `${ticket.ticket_number}`,
    );
    const subject = sprintf(
      APP_MESSAGES.TROUBLE_TICKET_MESSAGE.OVER_TAT.EMAIL.subject,
      `${ticket.ticket_number}`,
    );
    await this.troubleTicketEventHandleService.sendEmails(
      ticket,
      groupUser,
      title,
      subject,
      permission,
    );

    return { ...updateBody };
  }
}
