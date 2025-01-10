import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { TroubleTicketPause } from 'src/entities/trouble-ticket-pause.entity';
import { TroubleTicketPauseRepository } from './trouble-ticket-pause.repository';
import {
  CreateTroubleTicketPauseModel,
  UpdateTroubleTicketPauseModel,
} from 'src/models/trouble-ticket-pause.model';
import { TroubleTicketPauseModel } from 'src/models/trouble-ticket.model';
import { FetchUserModel } from 'src/models/user.model';
import { DataSource, QueryRunner } from 'typeorm';
import { TroubleTicketService } from '../trouble-ticket/trouble-ticket.service';
import { UserService } from '../user/user.service';
import * as moment from 'moment';
import {
  APP_CONSTANTS,
  DATE_FORMATS,
  DROPDOWN_ITEM_IDS,
} from 'src/common/enums/enums';
import { TroubleTicketAssignedService } from '../trouble-ticket-assigned/trouble-ticket-assigned.service';
import { PauseTicketQueueService } from 'src/microservices/queues/pause-ticket/pause-ticket.service';
import { SubDepartmentService } from '../sub-department/sub-department.service';

@Injectable()
export class TroubleTicketPauseService extends BaseService<TroubleTicketPause> {
  constructor(
    private readonly troubleTicketPauseRepository: TroubleTicketPauseRepository,
    private readonly troubleTicketService: TroubleTicketService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly troubleTicketAssignedService: TroubleTicketAssignedService,
    // @Inject(forwardRef(() => PauseTicketQueueService))
    private readonly pauseTicketQueueService: PauseTicketQueueService,
    private readonly subDepartmentService: SubDepartmentService,
  ) {
    super(troubleTicketPauseRepository);
  }

  async createTroubleTicketPause(
    pauseData: TroubleTicketPauseModel,
    user: FetchUserModel,
    queryRunner: QueryRunner,
  ) {
    const payload: CreateTroubleTicketPauseModel = {
      pause_start_time: pauseData.pause_start_time,
      pause_end_time: pauseData.pause_end_time,
      pause_reason: pauseData.pause_reason,
      is_approved: false,
      paused_by: pauseData.created_by,
      sub_department_id: user.sub_department_id,
      trouble_ticket_id: pauseData.id,
      created_by: pauseData.created_by,
    };
    const logData = {
      comment: pauseData.comment,
      updated_by: pauseData.created_by,
      attachment: pauseData?.attachment,
    };
    await this.troubleTicketService.handleLogs(
      pauseData.id,
      logData,
      queryRunner,
    );
    return this.create(payload, queryRunner.manager);
  }

  async updatePauseRequest(
    id: number,
    pauseData: UpdateTroubleTicketPauseModel,
    queryRunner: QueryRunner,
  ) {
    const { pause_end_time, pause_start_time, updated_by } = pauseData;
    const start = new Date(pause_start_time);
    const end = new Date(pause_end_time);

    let totalTime = Math.floor((end.getTime() - start.getTime()) / 1000);
    let queueDelayTime = Math.floor(
      (end.getTime() - new Date().getTime()) / 1000,
    );

    if (queueDelayTime < 0) {
      queueDelayTime = 0;
    }
    if (totalTime < 0) {
      totalTime = 0;
    }
    const pausePayload = {
      total_paused_duration: totalTime,
      approved_by: updated_by,
      is_approved: true,
      pause_end_time,
      pause_start_time,
    };
    await this.updateWithTransactionScope(
      { id: id },
      pausePayload,
      queryRunner.manager,
    );

    const logData = {
      comment: pauseData.comment,
      updated_by: pauseData.updated_by,
      attachment: pauseData?.attachment,
    };
    await this.troubleTicketService.handleLogs(id, logData, queryRunner);
    return { totalTime: totalTime, queueDelayTime: queueDelayTime };
  }

  async getTotalTimeByTicket(ticketId: number, pauseId: number) {
    return this.troubleTicketPauseRepository.getTotalPauseTimeByTicket(
      ticketId,
      pauseId,
    );
  }

  async cancelPauseTicket(pauseId: number, queryRunner?: QueryRunner) {
    return this.deleteRecord({ id: pauseId });
  }

  async createPauseTicketRequest(pauseData: TroubleTicketPauseModel) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user = await this.userService.getUserById(pauseData.created_by);
      const ticket = await this.troubleTicketService.findByCondition(
        {
          id: pauseData.id,
        },
        null,
        ['currentStatus', 'createdByUser', 'assignedToUser'],
      );
      const subDepartment = await this.subDepartmentService.findById({
        id: ticket.createdByUser.sub_department_id,
      });
      const groupUser = await this.userService.findGroupUserBySubDepartment(
        subDepartment,
        ticket?.region_id ? [ticket.region_id] : null,
      );
      const formateStartTime = moment(pauseData.pause_start_time).format(
        DATE_FORMATS.DATETIME,
      );
      const ss = formateStartTime;
      const formateEndTime = moment(pauseData.pause_end_time).format(
        DATE_FORMATS.DATETIME,
      );

      // create pause Request
      const pauseTicket = await this.createTroubleTicketPause(
        pauseData,
        user,
        queryRunner,
      );

      //update ticket
      const updatePayload =
        await this.troubleTicketService.transformedTroubleTicketPayload(
          ticket.status,
          pauseData.created_by,
          groupUser?.id || null,
          ticket.createdByUser.sub_department_id,
        );
      await this.troubleTicketAssignedService.createAssignedUser(
        ticket.id,
        pauseData.created_by,
        groupUser?.id || null,
        ticket.createdByUser.sub_department_id,
        queryRunner,
      );
      const ticketUpdatePayload = {
        ...updatePayload,
        current_pause_id: pauseTicket.id,
        message: `${user.full_name} has requested for ticket pause from ${formateStartTime} to ${formateEndTime}.`,
        message_title: `Ticket pause request`,
      };
      const updatedTicket =
        await this.troubleTicketService.updateWithTransactionScope(
          { id: ticket.id },
          ticketUpdatePayload,
          queryRunner.manager,
        );

      await this.troubleTicketService.handleLogs(
        pauseData.id,
        {
          status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.Pause,
          comment: pauseData.comment,
          attachment: pauseData?.attachment,
          updated_by: pauseData.created_by,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return updatedTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async approvePauseTicket(
    id: number,
    pauseData: UpdateTroubleTicketPauseModel,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { pause_end_time, updated_by, ticketId, attachment } = pauseData;
      const updatedUser = await this.userService.getUserById(updated_by);

      // update pause request
      const updatePause = await this.updatePauseRequest(
        id,
        pauseData,
        queryRunner,
      );

      const message = `${
        updatedUser.full_name
      } has approved and ticket paused for ${Math.floor(
        updatePause.totalTime / 60,
      )} minutes.`;
      // update ticket
      const total_time = await this.getTotalTimeByTicket(ticketId, id);
      const total_pause_duration_in_sec = Math.floor(
        total_time + updatePause.totalTime,
      );
      const updateTicketPayload = {
        total_pause_duration_in_sec: total_pause_duration_in_sec,
        last_unpause_date_time: pause_end_time,
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.Pause,
        message: message,
        message_title: `Ticket pause request approved`,
      };

      const troubleTicketStatus =
        await this.troubleTicketService.updateWithTransactionScope(
          { id: ticketId },
          updateTicketPayload,
          queryRunner.manager,
        );

      await this.troubleTicketService.handleLogs(
        ticketId,
        {
          status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.Pause,
          comment: pauseData.comment,
          attachment: attachment,
          updated_by: pauseData.updated_by,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();
      if (troubleTicketStatus) {
        const job = {
          id: id,
          message,
          pauseData: { ticketId: ticketId, updated_by: pauseData.updated_by },
        };
        await this.pauseTicketQueueService.addJobInQueue(
          job,
          updatePause.queueDelayTime,
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async resumePauseRequest(
    id: number,
    resumeData: UpdateTroubleTicketPauseModel,
    type: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const ticket = await this.troubleTicketService.findByCondition(
        { id: resumeData.ticketId },
        null,
        [
          'currentStatus',
          'createdByUser',
          'assignedToUser',
          'statusLog',
          'assignedLog',
        ],
      );
      //const previousStatus = ticket.statusLog[ticket.statusLog.length - 2];

      const pauseData = await this.findById({
        id: id,
      });

      const previousAssignedUser = await this.userService.getUserById(
        pauseData.paused_by,
      );

      const subDepartment = await this.subDepartmentService.findById({
        id: previousAssignedUser.sub_department_id,
      });
      const previousGroupUser =
        await this.userService.findGroupUserBySubDepartment(
          subDepartment,
          ticket?.region_id ? [ticket.region_id] : null,
        );
      const updatedUser = await this.userService.getUserById(
        resumeData.updated_by,
      );

      //update pause
      const { totalTime } = await this.updatePauseRequest(
        id,
        {
          pause_end_time: new Date(),
          pause_start_time: pauseData.pause_start_time,
          updated_by: resumeData.updated_by,
        },
        queryRunner,
      );
      const total_time = await this.getTotalTimeByTicket(
        resumeData.ticketId,
        id,
      );
      const total_pause_duration_in_sec = Math.abs(total_time + totalTime);

      //update ticket
      const updatePayload =
        await this.troubleTicketService.transformedTroubleTicketPayload(
          ticket.status,
          resumeData.updated_by,
          previousGroupUser?.id || null,
          previousAssignedUser.sub_department_id,
        );
      await this.troubleTicketAssignedService.createAssignedUser(
        ticket.id,
        resumeData.updated_by,
        previousGroupUser?.id,
        previousAssignedUser.sub_department_id,
        queryRunner,
      );
      const updateTroubleTicketPayload = {
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.PENDING,
        total_pause_duration_in_sec: total_pause_duration_in_sec,
        last_unpause_date_time: resumeData.pause_end_time,
        ...updatePayload,
        message: `${updatedUser.full_name} has resumed ticket and assigned to ${previousAssignedUser.full_name}`,
        message_title: `Resume Ticket`,
      };
      const updateTicket =
        await this.troubleTicketService.updateWithTransactionScope(
          { id: resumeData.ticketId },
          updateTroubleTicketPayload,
          queryRunner.manager,
        );

      await this.troubleTicketService.handleLogs(
        resumeData.ticketId,
        {
          status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.Pause,
          comment: resumeData.comment,
          attachment: resumeData?.attachment,
          updated_by: resumeData.updated_by,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return updateTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      if (type === APP_CONSTANTS.TYPE.MANUAL)
        this.pauseTicketQueueService.getJobQueue(id);
      await queryRunner.release();
    }
  }

  async cancelPauseRequest(
    pauseId: number,
    ticketId: number,
    updated_by: number,
    comment: string,
    attachment?: any,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const updatedUser = await this.userService.getUserById(updated_by);

      const pauseData = await this.findById({ id: pauseId });
      const previousAssignedUser = await this.userService.getUserById(
        pauseData.paused_by,
      );
      const previousUser = pauseData;
      const ticket = await this.troubleTicketService.findById({ id: ticketId });
      const subDepartment = await this.subDepartmentService.findById({
        id: previousUser.sub_department_id,
      });
      const previousGroupUser =
        await this.userService.findGroupUserBySubDepartment(
          subDepartment,
          ticket?.region_id ? [ticket.region_id] : null,
        );
      //update ticket and pause request

      const updatePayload = {
        message: `${updatedUser.full_name} has rejected pause request.`,
        messageTitle: `Reject Pause Request`,
        current_pause_id: null,
        assigned_to_id: previousGroupUser.id,
        assigned_from_id: updated_by,
        updated_by: updated_by,
        sub_department_id: previousAssignedUser.sub_department_id,
        is_assigned: false,
      };
      await this.troubleTicketService.updateWithTransactionScope(
        { id: ticketId },
        updatePayload,
        queryRunner.manager,
      );

      //await this.cancelPauseTicket(pauseId, queryRunner);
      await this.troubleTicketService.handleLogs(
        ticketId,
        {
          status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.Pause,
          comment: comment,
          attachment: attachment,
          updated_by: updated_by,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
