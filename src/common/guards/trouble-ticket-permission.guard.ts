import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { TroubleTicketService } from 'src/modules/trouble-ticket/trouble-ticket.service';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TroubleTicketGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private troubleTicketService: TroubleTicketService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    const request = context.switchToHttp().getRequest();
    const troubleTicketId = request.params.id;
    const where: FindOptionsWhere<TroubleTicket> = {
      id: troubleTicketId,
    };
    const ticket = await this.troubleTicketService.findById(where);

    const createdUser = await this.userService.getUserById(ticket.created_by);

    const user: User = request.user;

    if (
      user.roles.some((role) => role.name === 'SUPER_ADMIN') ||
      user.id === createdUser.id ||
      user.sub_department_id === createdUser.sub_department_id
    ) {
      return true;
    }

    const assignedUser = await this.userService.getUserById(
      ticket.assigned_to_id,
    );

    if (assignedUser.id === user.id && ticket.is_assigned) {
      return true;
    }
    if (ticket.sub_department_id === user.sub_department_id) {
      return true;
    }
  }
}

// if (
//   ticket.sub_department_id === user.sub_department_id &&
//   !ticket.is_assigned
// ) {
//   return true;
// }
