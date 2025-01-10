import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { TroubleTicketRepository } from './trouble-ticket.repository';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import {
  BulkUpdateModel,
  ReturnTroubleTicketModel,
  TroubleTicketActionModel,
  TroubleTicketFilterModel,
  TroubleTicketLogsModel,
  TroubleTicketModel,
  TroubleTicketRcaModel,
  UpdateTroubleTicketModel,
} from 'src/models/trouble-ticket.model';
import { TroubleTicketStatusLogService } from '../trouble-ticket-status-log/trouble-ticket-status-log.service';
import { DataSource, QueryRunner, Not, IsNull, In } from 'typeorm';
import { UserService } from '../user/user.service';
import { TroubleTicketAssignedService } from '../trouble-ticket-assigned/trouble-ticket-assigned.service';
import { PaginatedResultsModel } from 'src/models/pagination.model';
import { TroubleTicketCategoryService } from '../trouble-ticket-category/trouble-ticket-category.service';
import {
  APP_CONSTANTS,
  AppType,
  DROPDOWN_ITEM_IDS,
  NetworkType,
  RecordStatus,
  UserType,
} from 'src/common/enums/enums';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { AlarmFilterConfigService } from '../alarm-filter-config/alarm-filter-config.service';
import { NceAlarmsService } from '../nce-alarms/nce-alarms.service';
import { ObsAlertsService } from '../obs-alerts/obs-alerts.service';
import { CommentLogService } from '../comment-log/comment-log.service';
import { UploadFileMapService } from '../upload/upload-file-map.service';
import { UploadFileMapModel } from 'src/models/upload-file-map.model';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { SubDepartmentService } from '../sub-department/sub-department.service';
import { json2csv } from 'json-2-csv';
import { ReportModel } from 'src/models/report.model';
import { AlarmDelayedActionsModel } from 'src/models/alarm-delayed-actions.model';
import { FetchUserModel } from 'src/models/user.model';
import { RegionService } from '../region/region.service';
import { AccumulatedTroubleTicketService } from '../accumulated-trouble-ticket/accumulated-trouble-ticket.service';
import { TroubleTicketOverTATQueueService } from 'src/microservices/queues/trouble-ticket-overTAT-queue/trouble-ticket-overTAT.service';
import { NceGponAlarmsService } from '../nce-gpon-alarms/nce-gpon-alarms.service';
import { NokiaTxnAlarmsService } from '../nokia-txn-alarms/nokia-txn-alarms.service';
import { LdiSoftSwitchAlarmService } from '../ldi-softswitch-alarm/ldi-softswitch-alarm.service';

const helperFunctions = new HelperFunctions();
@Injectable()
export class TroubleTicketService extends BaseService<TroubleTicket> {
  static relations = [
    'troubleTicketCategory',
    'troubleTicketMedium',
    'currentStatus',
    'assignedToUser',
    'assignedFromUser',
    'department',
    'subDepartment',
    'statusLog',
    'statusLog.statusLog',
    'troubleTicketSubCategory',
    'attachment',
    'resolutionReason',
    'troubleTicketPause',
    'currentTicketPause',
    'createdByUser',
    'createdByUser.sub_department',
    'cancelReason',
    'outageAlarms',
    'outageAlarms.observiumAlert',
    'priorityLevel',
  ];
  constructor(
    private readonly troubleTicketRepository: TroubleTicketRepository,
    private readonly troubleTicketStatusLogService: TroubleTicketStatusLogService,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly troubleTicketAssignedService: TroubleTicketAssignedService,
    private readonly troubleTicketCategoryService: TroubleTicketCategoryService,
    private readonly alarmFilterConfigService: AlarmFilterConfigService,
    private readonly nceAlarmsService: NceAlarmsService,
    private readonly obsAlertsService: ObsAlertsService,
    private readonly commentLogService: CommentLogService,
    private readonly uploadFileMapService: UploadFileMapService,
    private readonly subDepartmentService: SubDepartmentService,
    private readonly env: EnvironmentConfigService,
    private regionService: RegionService,
    private accumulatedTroubleTicketService: AccumulatedTroubleTicketService,
    private readonly troubleTicketOverTATQueueService: TroubleTicketOverTATQueueService,
    private readonly nceGponAlarmsService: NceGponAlarmsService,
    private readonly nokiaTxnAlarmsService: NokiaTxnAlarmsService,
    private readonly ldiSoftSwitchAlarmService: LdiSoftSwitchAlarmService,
  ) {
    super(troubleTicketRepository);
  }

  /**
   *
   * @param body
   * @returns
   * @description jhfg
   */
  async createTroubleTicket(
    body: TroubleTicketModel,
  ): Promise<TroubleTicketModel> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const pendingStatusId = DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.PENDING;
      const { tat_start_time, tat_end_time, tat, tatType, tatMilliSecondTime } =
        await this.calculateStartEndTime(body);

      const relation = ['alarm_filter_config'];
      const alarm = await this.getAlarmDetails(
        body.alarm_config_id,
        body.alarm_id,
        relation,
      );

      const region = await this.regionService.getRegions(body.alarm_id);
      const subDepartment = await this.subDepartmentService.findById({
        id: body.sub_department_id,
      });
      const groupUser = await this.userService.findGroupUserBySubDepartment(
        subDepartment,
        region?.regionId ? [region.regionId] : null,
      );
      const createdTicketUser = await this.userService.getUserById(
        body.created_by,
      );

      const medium = {
        OBSERVIUM: 'OBSERVIUM_NMS',
        NCE: 'NCE_NMS',
        NCE_GPON: 'NCE_GPON_NMS',
        NOKIA_TXN: 'NOKIA_TXN_NMS',
        LDI_SOFTSWITCH_EMS: 'LDI_SOFTSWITCH_EMS_NMS',
      };

      const updatedBody = {
        ...body,
        status: pendingStatusId,
        tat_start_time: tat_start_time,
        tat_end_time: tat_end_time,
        total_tat: tat,
        tat_uom: tatType,
        app_type: alarm?.alarm_filter_config?.app_type,
        network_type: alarm.alarm_filter_config?.getNetworkType(),
        assigned_to_id: groupUser?.id || null,
        assigned_from_id: body.created_by,
        region_id: region?.regionId,
        medium:
          DROPDOWN_ITEM_IDS.TROUBLE_TICKET_MEDIUM[
            medium[alarm?.alarm_filter_config.app_type]
          ],
      };
      const updatePayload = this.transformedTroubleTicketPayload(
        updatedBody.status,
        body.created_by,
        updatedBody.assigned_to_id,
        updatedBody.sub_department_id,
      );
      //const troubleTicket = await this.create(updatedBody, queryRunner.manager);
      const troubleTicket = await this.create(
        { ...updatedBody, ...updatePayload },
        queryRunner.manager,
      );

      const ticketNumber = await this.generateTroubleTicketNumber(
        troubleTicket,
      );

      //update ticket number
      await this.create(
        {
          ...troubleTicket,
          ticket_number: ticketNumber,
          message: `${createdTicketUser.full_name} created ticket:${ticketNumber} and assigned to ${groupUser?.full_name}`,
          message_title: `Ticket Created.`,
        },
        queryRunner.manager,
      );

      await this.troubleTicketAssignedService.createAssignedUser(
        troubleTicket.id,
        body.created_by,
        updatedBody.assigned_to_id,
        updatedBody.sub_department_id,
        queryRunner,
      );

      const statusId = pendingStatusId;
      const statusPayload = {
        trouble_ticket_id: troubleTicket.id,
        status: statusId,
      };
      await this.troubleTicketStatusLogService.create(
        statusPayload,
        queryRunner.manager,
      );

      if (body?.attachment?.length) {
        for (let attachment of body.attachment) {
          const { name, url, id } = attachment as UploadFileMapModel;
          const payload: UploadFileMapModel = {
            name: name,
            url: url,
            related_id: troubleTicket.id,
            related_type: 'trouble_ticket',
            upload_file_id: id,
            document_type: attachment.mime,
            record_status: RecordStatus.ACTIVE,
            created_by: troubleTicket?.created_by,
            updated_by: troubleTicket?.created_by,
          };

          await this.uploadFileMapService.create(payload, queryRunner.manager);
        }
      }
      const payload = {
        troubleTicket: { ...troubleTicket },
        delay: tatMilliSecondTime,
      };
      if (troubleTicket)
        await this.troubleTicketOverTATQueueService.addJobInQueue(payload);

      await queryRunner.commitTransaction();
      return troubleTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getTroubleTicket(
    queryParam: TroubleTicketFilterModel,
    user: FetchUserModel,
  ): Promise<PaginatedResultsModel> {
    return this.troubleTicketRepository.getTroubleTicket(queryParam, user);
  }

  async getTroubleTicketById(
    id: number,
    condition?: any,
  ): Promise<ReturnTroubleTicketModel> {
    const relation = TroubleTicketService.relations;

    let modifiedCondition = {
      id: id,
    };
    if (condition) {
      modifiedCondition = { ...modifiedCondition, ...condition };
    }
    const query = await this.findByCondition(modifiedCondition, null, relation);
    query?.attachment?.forEach((element) => {
      element.url = `${this.env.getFileServerUrl()}/${element.url}`;
    });

    const alarmDetail = await this.getAlarmDetails(
      query.alarm_config_id,
      query.alarm_id,
      ['alarm_filter_config'],
    );
    const {
      alarmDetailNce,
      alarmDetailObservium,
      alarmDetailNCEGpon,
      ...restPayload
    } = query;

    const modifiedData: ReturnTroubleTicketModel = {
      ...restPayload,
      alarm_detail: alarmDetail,
    };
    //await this.troubleTicketUseCaseService.permissionUseCase(query);

    return modifiedData;
  }

  async getAlarmDetails(
    alarmFilterConfig: number,
    alarmId: number,
    relation?: string[],
  ) {
    const nceAlarm = this.nceAlarmsService.findByCondition(
      {
        alarm_filter_config_id: alarmFilterConfig,
        id: alarmId,
      },
      null,
      relation ?? null,
    );

    const obsAlarmDetail = this.obsAlertsService.findByCondition(
      {
        alarm_filter_config_id: alarmFilterConfig,
        id: alarmId,
      },
      null,
      relation ?? null,
    );

    const gponAlarmDetail = this.nceGponAlarmsService.findByCondition(
      {
        alarm_filter_config_id: alarmFilterConfig,
        id: alarmId,
      },
      null,
      [
        'nceGponNetworkElement',
        'nceGponNetworkElement.region',
        ...(relation ?? ''),
      ],
    );
    const nokiaAlarms = this.nokiaTxnAlarmsService.findByCondition(
      {
        alarm_filter_config_id: alarmFilterConfig,
        id: alarmId,
      },
      null,
      ['nokiaTxnNetworkElement', ...(relation ?? '')],
    );

    const ldiSoftswitch = this.ldiSoftSwitchAlarmService.findByCondition(
      {
        alarm_filter_config_id: alarmFilterConfig,
        id: alarmId,
      },
      null,
      ['ldiSoftswitchTrunkGroup', ...(relation ?? '')],
    );

    const alarmDetail = await Promise.all([
      nceAlarm,
      obsAlarmDetail,
      gponAlarmDetail,
      nokiaAlarms,
      ldiSoftswitch,
    ]);
    return alarmDetail.find((detail) => detail !== null);
  }

  async handleLogs(
    id: number,
    body: TroubleTicketLogsModel,
    queryRunner: QueryRunner,
  ) {
    const { status, comment, attachment } = body;

    //status logs
    if (status) {
      const statusLogPayload = {
        trouble_ticket_id: id,
        status: status,
        created_by: body.updated_by,
      };

      await this.troubleTicketStatusLogService.create(
        statusLogPayload,
        queryRunner.manager,
      );
    }

    //comment logs
    if (comment) {
      const commentBody = {
        comment: comment,
        related_id: id,
        related_table: 'trouble_ticket',
        created_by: body.updated_by,
      };
      await this.commentLogService.create(commentBody, queryRunner.manager);
    }

    //attachment logs
    const ttId = id;
    if (attachment) {
      for (let entries of attachment) {
        const { name, url, id } = entries;
        const payload: UploadFileMapModel = {
          name: name,
          url: url,
          related_id: ttId,
          related_type: 'trouble_ticket',
          upload_file_id: id,
          document_type: entries.mime,
          record_status: RecordStatus.ACTIVE,
          created_by: body.updated_by,
          updated_by: body.updated_by,
        };
        await this.uploadFileMapService.create(payload, queryRunner.manager);
      }
    }

    return true;
  }

  async updateStatus(id: number, body: TroubleTicketActionModel) {
    const {
      status,
      comment,
      attachment,
      sub_department_id,
      assigned_to_id,
      trouble_ticket_category_id,
      trouble_ticket_sub_category_id,
      updated_by,
    } = body;
    let updateTicket: TroubleTicket;
    let queryRunner: QueryRunner;
    const bodyMessage = body?.message || '';

    queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const ticket = await this.findByCondition(
        {
          id: id,
        },
        null,
        ['currentStatus', 'createdByUser'],
      );

      const updatedUser = await this.userService.getUserById(updated_by);
      if (body.status) {
        await this.validateStatusCondition(body.status, ticket);
        const message = `${APP_CONSTANTS.Trouble_TICKET_MESSAGE.STATUS_CHANGE(
          updatedUser.full_name,
          APP_CONSTANTS.TROUBLE_TICKET_ID_STATUS[ticket.status],
          APP_CONSTANTS.TROUBLE_TICKET_ID_STATUS[status],
        )} ${bodyMessage}`;
        const message_title =
          APP_CONSTANTS.Trouble_TICKET_MESSAGE.UPDATE_STATUS_TITLE;
        body = {
          ...body,
          assigned_from_id: body.updated_by,
          message: message,
          message_title: message_title,
        };
      }

      if (assigned_to_id || sub_department_id) {
        let toUser = null;
        const fromUser = await this.userService.getUserById(updated_by);
        toUser =
          assigned_to_id &&
          (await this.userService.getUserById(assigned_to_id));
        const subDepartment = await this.subDepartmentService.findById({
          id: sub_department_id,
        });
        body = {
          ...body,
        };
        if (
          sub_department_id !== ticket.sub_department_id ||
          assigned_to_id !== ticket.assigned_to_id
        ) {
          body = {
            ...body,
            message: `${fromUser.full_name} assigned Ticket:${
              ticket.ticket_number
            } to ${toUser?.full_name || subDepartment.name}`,
            message_title: `Ticket updated`,
          };
          await this.updateWithTransactionScope(
            {
              id: id,
            },
            {
              ...body,
            },
            queryRunner.manager,
          );
        }
      }
      if (trouble_ticket_category_id || trouble_ticket_sub_category_id) {
        let updateSubCat = null;
        const fromUser = await this.userService.getUserById(updated_by);
        const updateCat = await this.troubleTicketCategoryService.findById({
          id: trouble_ticket_category_id,
        });
        const previousCat = await this.troubleTicketCategoryService.findById({
          id: ticket.trouble_ticket_category_id,
        });
        const previousSubCat = await this.troubleTicketCategoryService.findById(
          { id: ticket.trouble_ticket_sub_category_id },
        );
        if (trouble_ticket_sub_category_id) {
          updateSubCat = await this.troubleTicketCategoryService.findById({
            id: trouble_ticket_sub_category_id,
          });
        }
        const { tat_start_time, tat_end_time, tat, tatType } =
          await this.calculateStartEndTime({
            trouble_ticket_category_id,
            trouble_ticket_sub_category_id,
          });
        body = {
          ...body,
          tat_start_time: tat_start_time,
          tat_end_time: tat_end_time,
          total_tat: tat,
          tat_uom: tatType,
        };
        if (
          updateCat.id !== previousCat.id ||
          previousSubCat.id !== updateSubCat?.id
        ) {
          body = {
            ...body,
            message: `${
              fromUser.full_name
            } has changed category/sub-category from ${previousCat.name}/${
              previousSubCat.name
            } to ${updateCat.name}${
              updateSubCat?.name ? `/${updateSubCat?.name}` : ''
            }`,
            message_title: `Ticket category/sub-category changed`,
          };
          await this.updateWithTransactionScope(
            {
              id: id,
            },
            {
              ...body,
            },
            queryRunner.manager,
          );
        }
      }

      if ((sub_department_id || assigned_to_id) && !body.is_rca_required) {
        const assignedPayload = await this.updateSubDepartment(ticket, body);
        body = { ...body, ...assignedPayload };
        await this.troubleTicketAssignedService.createAssignedUser(
          ticket.id,
          body.updated_by,
          body?.assigned_to_id,
          body.sub_department_id,
          queryRunner,
        );
      }

      if (body.status === DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED) {
        const updatedBody = await this.resolvedStatus(
          ticket,
          body,
          updatedUser,
          queryRunner,
        );

        body = {
          ...body,
          ...updatedBody,
          message: `${updatedBody.message} ${bodyMessage}`,
        };
      }

      if (body.is_rca_required) {
        const updatedBody = await this.rcaStatus(
          ticket,
          body,
          updatedUser,
          queryRunner,
        );
        body = { ...body, ...updatedBody };
      }

      if (body.status === DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED) {
        const timeDiff = helperFunctions.calculateTimeDifference(
          ticket.created_at,
          new Date(),
        );
        const completedTime = `${Math.ceil(
          +timeDiff - ticket.total_pause_duration_in_sec / 60,
        )}`;
        body.completed_time = completedTime;
        body.completed_Date_Time = new Date();
      }

      // update trouble ticket status
      const updatedBody = body;
      delete updatedBody['attachment'];
      updateTicket = await this.updateWithTransactionScope(
        {
          id: id,
        },
        {
          ...updatedBody,
        },
        queryRunner.manager,
      );

      // Maintain trouble ticket history
      await this.handleLogs(
        id,
        { status: body.status, comment, attachment, updated_by },
        queryRunner,
      );
      await queryRunner.commitTransaction();

      return updateTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }
  async updateSubDepartment(
    ticket: TroubleTicket,
    body: TroubleTicketActionModel,
  ) {
    await this.validateAssignedPermission(ticket, body);
    const subDepartment = await this.subDepartmentService.findById({
      id: body.sub_department_id,
    });
    const groupUser = await this.userService.findGroupUserBySubDepartment(
      subDepartment,
      ticket.region_id ? [ticket.region_id] : null,
    );

    const assignedPayload = await this.transformedTroubleTicketPayload(
      ticket.status,
      body.updated_by,
      body?.assigned_to_id || groupUser?.id,
      body.sub_department_id,
    );

    return assignedPayload;
  }

  async resolvedStatus(
    ticket: TroubleTicket,
    body: TroubleTicketActionModel,
    updatedUser: FetchUserModel,
    queryRunner: QueryRunner,
  ) {
    let { resolution_comment, resolution_reason, rca, updated_by } = body;

    let is_rca_awaited = body?.is_rca_awaited || false;
    rca = { ...rca, created_by: body.updated_by };
    //let groupUserId = body.assigned_to_id;
    let message = ``;
    let updatedBody = { ...body };
    if (!resolution_comment || !resolution_reason) {
      throw new Error(APP_CONSTANTS.Trouble_TICKET_MESSAGE.RESOLUTION_REASON);
    }

    const timeDiff = helperFunctions.calculateTimeDifference(
      ticket.created_at,
      new Date(),
    );
    const resolvedTime = `${Math.ceil(
      +timeDiff - ticket.total_pause_duration_in_sec / 60,
    )}`;

    // update user
    switch (is_rca_awaited) {
      case true: {
        const subDepartment = await this.subDepartmentService.findById({
          id: ticket.sub_department_id,
        });
        const groupUser = await this.userService.findGroupUserBySubDepartment(
          subDepartment,
          ticket.region_id ? [ticket.region_id] : null,
        );
        const message = `${updatedUser.full_name} resolved ticket:${ticket.ticket_number} and RCA is Awaited.`;
        updatedBody = {
          ...updatedBody,
          status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RCA_AWAITED,
          message: message,
          is_assigned: false,
          assigned_to_id: groupUser.id,
        };

        await this.handleLogs(
          ticket.id,
          {
            status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED,
            updated_by,
          },
          queryRunner,
        );

        break;
      }
      case false: {
        if (!rca) {
          throw new BadRequestException('RCA is required.');
        }
        const updateRca = await this.rcaTicketHandler(
          ticket.id,
          rca,
          queryRunner,
        );
        const subDepartment = await this.subDepartmentService.findById({
          id: ticket.createdByUser.sub_department_id,
        });
        const groupUser = await this.userService.findGroupUserBySubDepartment(
          subDepartment,
          ticket.region_id ? [ticket.region_id] : null,
        );
        const message = `${updatedUser.full_name} resolved ticket: ${
          ticket.ticket_number
        } and return ticket back to ${
          groupUser.full_name || ticket.createdByUser.sub_department?.name
        }.`;

        updatedBody = {
          ...updatedBody,
          ...updateRca,
          message: message,
          assigned_to_id: groupUser.id,
          is_assigned: false,
        };
        break;
      }
    }

    // update body

    updatedBody = {
      ...updatedBody,
      resolved_time: resolvedTime,
      resolved_Date_Time: new Date(),
      resolved_by_sub_department: updatedUser.sub_department_id,
      assigned_from_id: body.updated_by,
      department_id: ticket.createdByUser.department_id,
      message_title: APP_CONSTANTS.Trouble_TICKET_MESSAGE.UPDATE_STATUS_TITLE,
      resolution_comment: resolution_comment,
      resolution_reason: resolution_reason,
    };

    return updatedBody;
  }

  async rcaStatus(
    ticket: TroubleTicket,
    body: TroubleTicketActionModel,
    updatedUser: FetchUserModel,
    queryRunner: QueryRunner,
  ) {
    if (!body?.sub_department_id) {
      queryRunner.commitTransaction();
      throw new Error('Sub Department is required.');
    }

    const subDepartment = await this.subDepartmentService.findById({
      id: body.sub_department_id,
    });
    const groupUser = await this.userService.findGroupUserBySubDepartment(
      subDepartment,
      ticket.region_id ? [ticket.region_id] : null,
    );

    let assignedPayload = await this.transformedTroubleTicketPayload(
      ticket.status,
      body.updated_by,
      groupUser?.id,
      body.sub_department_id,
    );
    const message = `${updatedUser.full_name} requested RCA and sent to ${
      groupUser?.full_name || subDepartment.name
    }.`;
    const message_title = `RCA Requested`;
    assignedPayload.message = message;
    assignedPayload.message_title = message_title;
    assignedPayload = { ...assignedPayload, is_rca_required: true };

    await this.troubleTicketAssignedService.createAssignedUser(
      ticket.id,
      body.updated_by,
      groupUser?.id,
      body.sub_department_id,
      queryRunner,
    );

    return assignedPayload;
  }

  async assignedToUser(
    id: number,
    updated_by: number,
    assignedToUser: number,
    subDepartmentId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const relation = ['currentStatus'];
      const troubleTicket = await this.findByCondition(
        {
          id: id,
        },
        null,
        relation,
      );

      const fromUser = await this.userService.getUserById(updated_by);
      const toUser = await this.userService.getUserById(assignedToUser);
      const updatePayload = await this.transformedTroubleTicketPayload(
        troubleTicket.status,
        updated_by,
        assignedToUser,
        subDepartmentId,
      );
      await this.troubleTicketAssignedService.createAssignedUser(
        troubleTicket.id,
        updated_by,
        assignedToUser,
        subDepartmentId,
        queryRunner,
      );
      let payload = {
        ...updatePayload,
      };

      if (
        troubleTicket.status === DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.PENDING
      ) {
        payload = {
          ...payload,
          status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.ASSIGNED,
        };

        await this.handleLogs(
          id,
          {
            status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.ASSIGNED,
            updated_by,
          },
          queryRunner,
        );
      }

      const updateTT = await this.updateWithTransactionScope(
        {
          id: id,
        },
        {
          ...payload,
          message: `${toUser.full_name} assigned Ticket:${troubleTicket.ticket_number} to him self.`,
          message_title: `Ticket Assigned`,
        },
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();

      return updateTT;
    } catch (error) {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  async calculateStartEndTime(body: any) {
    const categoryId =
      body.trouble_ticket_sub_category_id || body.trouble_ticket_category_id;
    const ticketCategory =
      await this.troubleTicketCategoryService.getTroubleTicketById(categoryId);
    const tat = ticketCategory.tat;
    const tatType = ticketCategory.tat_uom;
    const { tat_start_time, tat_end_time, tatMilliSecondTime } =
      helperFunctions.calculateStartEndTime(tat, tatType);
    return { tat_start_time, tat_end_time, tat, tatType, tatMilliSecondTime };
  }

  async generateTroubleTicketNumber(troubleTicket: TroubleTicket) {
    const type = {
      NCE: 'TX',
      OBSERVIUM: 'IP',
      NCE_GPON: 'GPON',
      NOKIA_TXN: 'TX',
      LDI_SOFTSWITCH_EMS: 'LDI_SOFTSWITCH_EMS',
    };

    const { app_type } = troubleTicket;

    const ticket_number = `TIC-${type[app_type]}-${troubleTicket.id}`;
    return ticket_number;
  }

  async validateStatusCondition(status: number, ticket: TroubleTicketModel) {
    const label = status;
    if (label === APP_CONSTANTS.troubleTicketStatus.ASSIGNED) {
      if (ticket.status !== APP_CONSTANTS.troubleTicketStatus.PENDING) {
        throw new Error('status is not correct');
      }
    } else if (
      label !== APP_CONSTANTS.troubleTicketStatus.ASSIGNED &&
      label !== APP_CONSTANTS.troubleTicketStatus.RESOLVED &&
      label !== APP_CONSTANTS.troubleTicketStatus.COMPLETED &&
      label !== APP_CONSTANTS.troubleTicketStatus.RE_OPEN &&
      label !== APP_CONSTANTS.troubleTicketStatus.PENDING
    ) {
      throw new Error('invalid status');
    }
  }

  async leaveTicket(
    id: number,
    updated_by: number,
    comment: string,
    attachment: any,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const ticket = await this.findById({
        id: id,
      });
      const previousStatus = ticket.status;
      const updateStatus = {
        32: 32,
        33: 32,
        34: 34,
        35: 35,
      };

      const subDepartment = await this.subDepartmentService.findById({
        id: ticket.sub_department_id,
      });
      const groupUser = await this.userService.findGroupUserBySubDepartment(
        subDepartment,
        ticket.region_id ? [ticket.region_id] : null,
      );
      const currentUser = await this.userService.getUserById(updated_by);
      const payload = {
        is_assigned: false,
        assigned_to_id: groupUser?.id || null,
        status: updateStatus[previousStatus],
        message: APP_CONSTANTS.Trouble_TICKET_MESSAGE.LEAVE(
          currentUser.full_name,
        ),
        message_title: APP_CONSTANTS.Trouble_TICKET_MESSAGE.UPDATE_STATUS_TITLE,
      };
      const updateTicket = await this.updateWithTransactionScope(
        { id: id },
        payload,
        queryRunner.manager,
      );

      const updatePayload = {
        related_id: updateTicket.id,
        related_table: 'activity_log',
        created_by: updated_by,
      };
      //await this.activityLogService.create(updatePayload);
      const commentBody = {
        comment: comment,
        related_id: id,
        related_table: 'trouble_ticket',
        created_by: updated_by,
      };

      await this.handleLogs(
        id,
        {
          status: updateStatus[previousStatus],
          comment,
          attachment,
          updated_by,
        },
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return updateTicket;
    } catch (error) {
    } finally {
    }
  }

  async sentBack(id: number, body: UpdateTroubleTicketModel) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const { updated_by, comment, status, attachment } = body;
      const ticket = await this.findById({ id: id });
      const createdUserDetail = await this.userService.getUserById(
        ticket.created_by,
      );
      // const regionId = createdUserDetail.regions.map((r) => r.id);
      const subDepartment = await this.subDepartmentService.findById({
        id: createdUserDetail.sub_department_id,
      });
      const groupUser = await this.userService.findGroupUserBySubDepartment(
        subDepartment,
        ticket.region_id ? [ticket.region_id] : null,
      );

      const assignedUser = await this.userService.getUserById(
        ticket.assigned_to_id,
      );

      const payload = {
        is_assigned: false,
        assigned_to_id: groupUser?.id || null,
        status: ticket.status === 33 ? 32 : ticket.status,
        sub_department_id: createdUserDetail.sub_department_id,
        message: APP_CONSTANTS.Trouble_TICKET_MESSAGE.SENT_BACK(
          assignedUser.full_name,
          ticket.ticket_number,
          groupUser?.full_name
            ? groupUser?.full_name
            : createdUserDetail.sub_department.name,
        ),
        message_title: APP_CONSTANTS.Trouble_TICKET_MESSAGE.UPDATE_STATUS_TITLE,
      };
      const sentBack = await this.updateWithTransactionScope(
        {
          id: id,
        },
        payload,
        queryRunner.manager,
      );

      await this.handleLogs(
        id,
        { status, comment, attachment, updated_by },
        queryRunner,
      );
      //await this.commentLogService.create(commentBody, queryRunner.manager);
      await queryRunner.commitTransaction();
      return sentBack;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async validateAssignedPermission(
    ticket: TroubleTicketModel,
    body: TroubleTicketActionModel,
  ) {
    const userDetails = await this.userService.getUserById(body.updated_by);
    const ticketCreatedUser = await this.userService.getUserById(
      ticket.created_by,
    );

    // if (userDetails.sub_department_id !== ticketCreatedUser.sub_department_id) {
    //   throw new Error('User is not permitted to assign ticket');
    // }

    if (!body.sub_department_id) {
      throw new Error('Sub department is required.');
    }
  }

  async getTroubleTicketAssignedUsers(toUser: number, fromUser: number) {
    const toUserDetail = await this.userService.getUserById(toUser);
    const fromUserUserDetail = await this.userService.getUserById(fromUser);

    return {
      toUserName: toUserDetail.full_name,
      fromUserName: fromUserUserDetail.full_name,
    };
  }

  async reOpen(id: number, body: UpdateTroubleTicketModel) {
    const { comment, attachment, updated_by } = body;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const ticket = await this.findById({
        id: id,
      });
      if (ticket.status !== APP_CONSTANTS.troubleTicketStatus.RESOLVED) {
        throw new Error('status must be resolved');
      }

      const updatePayload = await this.transformedTroubleTicketPayload(
        ticket.status,
        body.updated_by,
        body?.assigned_to_id,
        body.sub_department_id,
      );
      const subDepartment = await this.subDepartmentService.findById({
        id: body.sub_department_id,
      });
      const groupUser = await this.userService.findGroupUserBySubDepartment(
        subDepartment,
        ticket.region_id ? [ticket.region_id] : null,
      );
      await this.troubleTicketAssignedService.createAssignedUser(
        ticket.id,
        body.updated_by,
        body?.assigned_to_id,
        body.sub_department_id,
        queryRunner,
      );
      const fromUser = await this.userService.getUserById(body.updated_by);
      let toUser: FetchUserModel;
      if (body?.assigned_to_id) {
        toUser = await this.userService.getUserById(body.assigned_to_id);
      }
      const updateStatus = await this.updateWithTransactionScope(
        { id: ticket.id },
        {
          ...updatePayload,
          status: APP_CONSTANTS.troubleTicketStatus.RE_OPEN,
          assigned_to_id: body?.assigned_to_id || groupUser?.id,
          message: `${fromUser?.full_name} reopened Ticket:${
            ticket.ticket_number
          } and assigned to ${toUser?.full_name || groupUser?.full_name}`,
          message_title: `Ticket Reopened`,
        },
        queryRunner.manager,
      );

      await this.handleLogs(
        id,
        {
          status: APP_CONSTANTS.troubleTicketStatus.RE_OPEN,
          comment,
          attachment,
          updated_by,
        },
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return updateStatus;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async generateReport(queryParam: ReportModel, user: FetchUserModel) {
    return this.troubleTicketRepository.generateReport(queryParam, user);
  }

  async generateCSV(data: any) {
    const csv = json2csv(data);
    //fs.writeFileSync('./uploads/file.csv', csv);
    const file = csv;
    return file;
  }

  async escalateTicket(data: AlarmDelayedActionsModel) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      //find alarm config
      const alarmConfig = await this.alarmFilterConfigService.findById({
        id: data.alarmConfigId,
      });

      // find sub department
      const createdSubDepartment = await this.subDepartmentService.findById({
        name: 'CNOC',
      });

      //find created user
      const createdUser = await this.userService.getByCondition({
        user_type: UserType.SYSTEM_USER,
      });
      let obsAlarmDetail: any;
      //handle ticket accumulation
      if (data.appType === AppType.OBSERVIUM) {
        obsAlarmDetail = await this.obsAlertsService.findByCondition({
          id: data.alarmId,
          nms_circuit_id: Not(IsNull()),
        });

        if (obsAlarmDetail?.nms_circuit_id) {
          const troubleTicket =
            await this.troubleTicketRepository.findTicketByCircuitId(
              obsAlarmDetail.nms_circuit_id,
              obsAlarmDetail.alarm_filter_config_id,
            );

          if (troubleTicket) {
            const payload = {
              ticket_id: troubleTicket.id,
              alarm_config_id: data.alarmConfigId,
              alarm_id: data.alarmId,
            };

            const obsAlert = await this.obsAlertsService.findById({
              id: data.alarmId,
            });

            const accumulatedTicket =
              await this.accumulatedTroubleTicketService.create(payload);

            await this.updateWithTransactionScope(
              { id: troubleTicket.id },
              {
                message: `Alarm id:${obsAlert.id} ${obsAlert.title} is attached to Ticket:${troubleTicket.ticket_number}`,
                message_title: `Outage`,
              },
              queryRunner.manager,
            );
            const outageAlarms =
              await this.accumulatedTroubleTicketService.findAll({
                where: { ticket_id: troubleTicket.id },
              });
            if (outageAlarms.length === 1) {
              const payload = {
                ticket_id: troubleTicket.id,
                alarm_config_id: troubleTicket.alarm_config_id,
                alarm_id: troubleTicket.alarm_id,
              };

              await this.accumulatedTroubleTicketService.create(
                { ...payload },
                queryRunner.manager,
              );
              const obsAlert = await this.obsAlertsService.findById({
                id: troubleTicket.alarm_id,
              });
              await this.updateWithTransactionScope(
                { id: troubleTicket.id },
                {
                  message: `Alarm id:${obsAlert.id} ${obsAlert.title} is attached to Ticket:${troubleTicket.ticket_number}`,
                  message_title: `Outage`,
                  is_outage_occurred: true,
                },
                queryRunner.manager,
              );
            }
            await queryRunner.commitTransaction();
            return troubleTicket;
          }
        }
      }

      // find to department
      const toDepartment = await this.subDepartmentService.findById({
        id: alarmConfig.ticket_escalation_initial_sub_department,
      });
      const ticketCat = await this.troubleTicketCategoryService.findById({
        id: alarmConfig.ticket_escalation_sub_category,
      });

      const subDepartment = await this.subDepartmentService.findById({
        id: alarmConfig.ticket_escalation_initial_sub_department,
      });
      const region = await this.regionService.getRegions(data.alarmId);
      const groupUser = await this.userService.findGroupUserBySubDepartment(
        subDepartment,
        region?.regionId ? [region.regionId] : null,
      );
      //
      const { tat_start_time, tat_end_time, tat, tatType, tatMilliSecondTime } =
        await this.calculateStartEndTime(
          alarmConfig.ticket_escalation_sub_category ||
            alarmConfig.ticket_escalation_category,
        );

      // trouble ticket payload

      const medium = {
        OBSERVIUM: 'OBSERVIUM_NMS',
        NCE: 'NCE_NMS',
        NCE_GPON: 'NCE_GPON_NMS',
        NOKIA_TXN: 'NOKIA_TXN_NMS',
        LDI_SOFTSWITCH_EMS: 'LDI_SOFTSWITCH_EMS_NMS',
      };

      const payload = {
        case_title: `Automated | ${alarmConfig.alarm_name} | ${ticketCat.name}`,
        alarm_id: data.alarmId,
        description: 'Automatic trouble ticket',
        alarm_config_id: data.alarmConfigId,
        trouble_ticket_category_id: alarmConfig.ticket_escalation_category,
        trouble_ticket_sub_category_id:
          alarmConfig.ticket_escalation_sub_category,
        medium: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_MEDIUM[medium[data.appType]],
        department_id: toDepartment.department_id,
        sub_department_id: alarmConfig.ticket_escalation_initial_sub_department,
        ticket_generation_type:
          DROPDOWN_ITEM_IDS.TROUBLE_TICKET_GENERATION_TYPE.AUTOMATED,
        alarm_config_can_revert:
          alarmConfig.can_revert_ticket_on_alarm_recovery,
        alarm_config_escalation_delay: alarmConfig.ticket_escalation_delay,
        created_by: createdUser?.id,
        assigned_to_id: groupUser?.id || null,
        assigned_from_id: createdUser.id,
        network_type: alarmConfig?.getNetworkType(),
        app_type: data.appType,
        tat_start_time: tat_start_time,
        tat_end_time: tat_end_time,
        total_tat: tat,
        tat_uom: tatType,
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.PENDING,
        region_id: region?.regionId,
      };
      const troubleTicket = await this.create(payload, queryRunner.manager);
      const updatePayload = await this.transformedTroubleTicketPayload(
        troubleTicket.status,
        createdUser.id,
        groupUser?.id || null,
        troubleTicket.sub_department_id,
      );
      const ticketNumber = await this.generateTroubleTicketNumber(
        troubleTicket,
      );
      const updatedTroubleTicket = await this.create(
        {
          ...troubleTicket,
          ...updatePayload,
          ticket_number: ticketNumber,
          message: `${createdUser.full_name} created ticket and assigned to ${groupUser?.full_name}`,
          message_title: `Ticket Created.`,
        },
        queryRunner.manager,
      );

      await this.troubleTicketAssignedService.createAssignedUser(
        troubleTicket.id,
        createdUser.id,
        groupUser?.id || null,
        troubleTicket.sub_department_id,
        queryRunner,
      );

      await this.handleLogs(
        troubleTicket.id,
        {
          status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.PENDING,
          updated_by: createdUser?.id,
        },
        queryRunner,
      );

      const overTatPayload = {
        troubleTicket: { ...updatedTroubleTicket },
        delay: tatMilliSecondTime,
      };
      if (updatedTroubleTicket)
        await this.troubleTicketOverTATQueueService.addJobInQueue(
          overTatPayload,
        );
      await queryRunner.commitTransaction();
      return troubleTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async cancelTroubleTicket(
    ticket: TroubleTicketModel,
    updatedUserId: number,
    cancelReason: number,
    comment: string,
    message: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      //Find Sub Department
      const createdSubDepartment = await this.subDepartmentService.findById({
        name: 'CNOC',
      });
      const groupUser = await this.userService.getByCondition({
        user_type: UserType.GROUP,
        sub_department_id: createdSubDepartment.id,
      });

      const sysUser = await this.userService.getByCondition({
        user_type: UserType.GROUP,
        sub_department_id: createdSubDepartment.id,
      });
      const updatedByUser = updatedUserId || sysUser.id;
      const payload = {
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
        message:
          message ||
          `Ticket:${ticket.ticket_number} is cancelled automatically.`,
        assigned_to_id: groupUser.id,
        updated_by: updatedByUser,
        cancel_reason: cancelReason,
        cancel_comment: comment,
      };
      await this.updateWithTransactionScope(
        {
          id: ticket.id,
        },
        payload,
        queryRunner.manager,
      );

      const statusLogPayload = {
        trouble_ticket_id: ticket.id,
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
        created_by: sysUser.id,
      };

      await this.troubleTicketStatusLogService.create(
        statusLogPayload,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async rcaTicketHandler(
    id: number,
    body: TroubleTicketRcaModel,
    queryRunner: QueryRunner,
  ) {
    const {
      rca_reason,
      corrective_action,
      preventive_step,
      rca_start_time,
      rca_end_time,
    } = body;
    const ticket = await this.findByCondition(
      {
        id: id,
      },
      null,
      [
        'currentStatus',
        'createdByUser',
        'assignedToUser',
        'createdByUser.regions',
      ],
    );
    const subDepartment = await this.subDepartmentService.findById({
      id: ticket.createdByUser.sub_department_id,
    });
    const regionId = ticket.createdByUser.regions.map((r) => r.id);
    const groupUser = await this.userService.findGroupUserBySubDepartment(
      subDepartment,
      ticket?.region_id ? [ticket.region_id] : null,
    );
    const assignedPayload = await this.transformedTroubleTicketPayload(
      ticket.status,
      body.created_by,
      groupUser?.id,
      ticket.createdByUser.sub_department_id,
    );
    await this.troubleTicketAssignedService.createAssignedUser(
      ticket.id,
      body.created_by,
      groupUser?.id,
      ticket.createdByUser.sub_department_id,
      queryRunner,
    );

    const message = `${
      ticket.assignedToUser.full_name
    } has attached RCA and sent back to ${
      groupUser?.full_name || ticket.createdByUser.sub_department.name
    }.`;
    const message_title = 'RCA Submitted';

    const updateBody = {
      rca_reason,
      corrective_action,
      preventive_step,
      rca_start_time,
      rca_end_time,
      ...assignedPayload,
      message,
      message_title,
      rca_submitted: true,
      is_rca_awaited: false,
      is_rca_required: false,
    };

    return updateBody;
  }

  async rcaTicket(id: number, body: TroubleTicketRcaModel) {
    const { comment, attachment, created_by } = body;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      let updateBody = await this.rcaTicketHandler(id, body, queryRunner);
      const status = DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED;
      updateBody = {
        ...updateBody,
        status: status,
      };
      await this.updateWithTransactionScope(
        { id: id },
        updateBody,
        queryRunner.manager,
      );

      await this.handleLogs(
        id,
        { status, comment, attachment, updated_by: created_by },
        queryRunner,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getRegions(ticketId: number) {
    return this.troubleTicketRepository.getRegions(ticketId);
  }

  async transformedTroubleTicketPayload(
    ticketStatus: number,
    assignedFromUser: number,
    assignedToUser: number,
    subDepartmentId: number,
  ) {
    let updatePayload: TroubleTicketActionModel = null;
    const user: FetchUserModel = await this.userService.getUserById(
      assignedToUser,
    );

    if (!assignedToUser && subDepartmentId) {
      updatePayload = {
        ...updatePayload,
        is_assigned: false,
        assigned_to_id: null,
        assigned_from_id: assignedFromUser,
        updated_by: assignedFromUser,
        sub_department_id: subDepartmentId,
      };
    }

    if (assignedToUser && subDepartmentId) {
      const userType = {
        GROUP: false,
        EMPLOYEE: true,
      };

      updatePayload = {
        ...updatePayload,
        is_assigned: userType[`${user.user_type}`],
        assigned_to_id: assignedToUser,
        assigned_from_id: assignedFromUser,
        updated_by: assignedFromUser,
        sub_department_id: subDepartmentId,
      };

      if (
        ticketStatus === DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.PENDING &&
        user.user_type !== 'GROUP'
      ) {
        const status = APP_CONSTANTS.troubleTicketStatus.ASSIGNED;
        const updatedUser = await this.userService.getUserById(
          assignedFromUser,
        );

        updatePayload = {
          ...updatePayload,
          message: APP_CONSTANTS.Trouble_TICKET_MESSAGE.STATUS_CHANGE(
            updatedUser.full_name,
            APP_CONSTANTS.TROUBLE_TICKET_ID_STATUS[ticketStatus],
            APP_CONSTANTS.TROUBLE_TICKET_ID_STATUS[status],
          ),
          status: status,
          updated_by: assignedFromUser,
        };
      }
    }
    return updatePayload;
  }

  async getTroubleTicketAlarm(id: number) {
    return this.troubleTicketRepository.getTroubleTicketAlarm(id);
  }

  async bulkUpdate(body: BulkUpdateModel, user: FetchUserModel) {
    const { created_by, ids, status, comment, ...otherPayload } = body;

    // if (status !== DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED ) {
    //   throw new BadRequestException(
    //     'Statue Should be Completed For Bulk Trouble Ticket Update.',
    //   );
    // }

    let extractIds: number[];
    switch (status) {
      case DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED: {
        const tt = await this.findAll({
          where: {
            id: In([...ids]),
            status: Not(DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED),
          },
        });

        extractIds = tt.map((t) => t.id);
        break;
      }
      case DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED: {
        const tt = await this.findAll({
          where: {
            id: In([...ids]),
            status: Not(DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED),
          },
        });

        extractIds = tt.map((t) => t.id);
        break;
      }
    }
    try {
      const updatePromises = extractIds.map((id) =>
        this.updateStatus(id, {
          ...otherPayload,
          status,
          comment,
          updated_by: created_by,
          resolution_comment: comment,
          message: 'In bulk update request.',
        }),
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
}
