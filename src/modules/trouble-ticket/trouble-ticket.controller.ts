import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TroubleTicketService } from './trouble-ticket.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTroubleTicketDto } from 'src/dto/trouble-ticket/cereate-trouble-ticket.dto';
import {
  ReturnTroubleTicketModel,
  TroubleTicketActionModel,
  TroubleTicketModel,
  UpdateTroubleTicketModel,
} from 'src/models/trouble-ticket.model';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { TroubleTicketFilterDto } from 'src/dto/trouble-ticket/trouble-ticket-filter.dto';
import { TroubleTicketAssignedUserDto } from 'src/dto/trouble-ticket/trouble-ticket-assigned-user.dto';
import { TroubleTicketUpdateStatusDto } from 'src/dto/trouble-ticket/trouble-ticket-update.dto';
import { PaginatedResultsModel } from 'src/models/pagination.model';
import { CommentLogService } from '../comment-log/comment-log.service';
import { CommentLog } from 'src/entities/comment-log.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { TroubleTicketEventHandleService } from './trouble-ticket-event-handle.service';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { TroubleTicketGuard } from 'src/common/guards/trouble-ticket-permission.guard';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { AlarmDelayedActionsModel } from 'src/models/alarm-delayed-actions.model';
import { TroubleTicketRcaDto } from 'src/dto/trouble-ticket/create-trouble-ticket-rca.dto';
import { TroubleTicketCancelDto } from 'src/dto/trouble-ticket/trouble-ticket-cancel.dto';
import { UserService } from '../user/user.service';
import { IUserRequestInterface } from 'src/interfaces/user.request.interface';
import { UpdateBulkTroubleTicketDto } from 'src/dto/trouble-ticket/update-bulk-trouble-ticket.dto';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';

@Controller('trouble-ticket')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class TroubleTicketController {
  constructor(
    private readonly troubleTicketService: TroubleTicketService,
    private readonly commentLogService: CommentLogService,
    private readonly activityLogService: ActivityLogService,
    private readonly troubleTicketEventHandleService: TroubleTicketEventHandleService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET.CREATED)
  async createTroubleTicket(
    @Body() body: CreateTroubleTicketDto,
  ): Promise<TroubleTicketModel> {
    var troubleTicket = await this.troubleTicketService.createTroubleTicket(
      body,
    );
    return troubleTicket;
  }

  @Get()
  async getTroubleTicket(
    @Query() queryParam: TroubleTicketFilterDto,
    @Req() req: IUserRequestInterface,
  ): Promise<PaginatedResultsModel> {
    const { user } = req;
    return this.troubleTicketService.getTroubleTicket(queryParam, user);
  }

  @Get('/:id')
  async getTroubleTicketById(
    @Param('id') id: number,
    @Req() req: IUserRequestInterface,
  ): Promise<ReturnTroubleTicketModel> {
    const { user } = req;
    const ttData = await this.troubleTicketService.getTroubleTicketById(id);
    const permission =
      await this.troubleTicketEventHandleService.troubleTicketPermission(
        user,
        ttData,
      );
    ttData.permissions = permission;

    return ttData;
  }

  @Patch('/:id')
  @UseGuards(TroubleTicketGuard)
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET.UPDATED)
  async updateTroubleTicket(
    @Body() body: TroubleTicketUpdateStatusDto,
    @Param('id') id: number,
  ): Promise<TroubleTicketModel> {
    return this.troubleTicketService.updateStatus(id, body);
  }

  @Patch('/:id/assign-me')
  @UseGuards(TroubleTicketGuard)
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET.ASSIGNED)
  async assignedUser(
    @Param('id') id: number,
    @Body() body: TroubleTicketAssignedUserDto,
    @Req() req: IUserRequestInterface,
  ) {
    const { updated_by } = body;
    const { user } = req;
    return this.troubleTicketService.assignedToUser(
      id,
      updated_by,
      updated_by,
      user.sub_department_id,
    );
  }

  @Patch('/:id/leave-ticket')
  @UseGuards(TroubleTicketGuard)
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET.LEAVE)
  async leaveTicket(
    @Param('id') id: number,
    @Body() body: TroubleTicketUpdateStatusDto,
  ) {
    const { updated_by, comment, attachment } = body;
    return this.troubleTicketService.leaveTicket(
      id,
      updated_by,
      comment,
      attachment,
    );
  }

  @Post('/:id/comment')
  //@UseGuards(TroubleTicketGuard)
  @ResponseMessageMetadata(APP_MESSAGES.COMMENT.CREATED)
  async createComment(@Param('id') id: number, @Body() body: any) {
    const commentBody = {
      ...body,
      related_id: id,
      related_table: 'trouble_ticket',
    };
    return this.commentLogService.create(commentBody);
  }

  @Get('/:id/comment')
  async getComment(@Param('id') id: number) {
    const where: FindManyOptions<CommentLog> = {
      where: { related_id: id },
      relations: [
        'user',
        'user.department',
        'user.sub_department',
        'user.designation',
      ],
      order: { id: 'DESC' },
    };
    return this.commentLogService.findAll(where);
  }

  @Get('/:id/activity-log')
  async getActivityLog(@Param('id') id: number) {
    const where: FindManyOptions<ActivityLog> = {
      where: { related_id: id },
      relations: [
        'user',
        'user.department',
        'user.sub_department',
        'user.designation',
      ],
      order: { id: 'DESC' },
    };
    return this.activityLogService.findAll(where);
  }

  @Patch('/:id/sent-back')
  @UseGuards(TroubleTicketGuard)
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET.SENT_BACK)
  async sentBack(
    @Param('id') id: number,
    @Body() body: UpdateTroubleTicketModel,
  ) {
    return this.troubleTicketService.sentBack(id, body);
  }

  @Patch('/:id/re-open')
  @UseGuards(TroubleTicketGuard)
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET.RE_OPEN)
  async reopenTroubleTicket(
    @Param('id') id: number,
    @Body() body: UpdateTroubleTicketModel,
  ) {
    return this.troubleTicketService.reOpen(id, body);
  }

  @Patch('/:id/cancel')
  async cancelTicket(
    @Param('id') id: number,
    @Body() Body: TroubleTicketCancelDto,
  ) {
    const { updated_by, cancelReason, comment } = Body;

    const ttId: FindOptionsWhere<TroubleTicket> = {
      id: id,
    };

    const troubleTicket: TroubleTicketModel =
      await this.troubleTicketService.findById(ttId);
    const updatedUser = await this.userService.getUserById(updated_by);
    const message = `Ticket:${troubleTicket.ticket_number} is cancelled by ${updatedUser.full_name}.`;
    return this.troubleTicketService.cancelTroubleTicket(
      troubleTicket,
      updated_by,
      cancelReason,
      comment,
      message,
    );
  }

  @Post('/escalate')
  async escalateTicket(@Body() body: AlarmDelayedActionsModel) {
    return this.troubleTicketService.escalateTicket(body);
  }

  @Post('/:id/rca')
  async rcaTicket(@Param('id') id: number, @Body() body: TroubleTicketRcaDto) {
    return this.troubleTicketService.rcaTicket(id, body);
  }

  @Get('/alarm/:id')
  async getTroubleTicketAlarm(@Param('id') id: number) {
    return this.troubleTicketService.getTroubleTicketAlarm(id);
  }

  @Post('/bulk-update')
  @UseGuards(RolePermissionGuard)
  @PermissionsMetadata(APP_PERMISSIONS.TROUBLE_TICKET.Bulk_Update)
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET.BULK_UPDATE)
  async bulkUpdate(
    @Body() body: UpdateBulkTroubleTicketDto,
    @Req() req: IUserRequestInterface,
  ) {
    const { user } = req;
    return this.troubleTicketService.bulkUpdate(body, user);
  }

  @Put(':id/priority')
  async updatePriority(
    @Param('id') id: number,
    @Body() body: { priority_level: number },
  ) {
    return this.troubleTicketService.update(
      { id: id },
      { priority_level: body.priority_level },
    );
  }
}
