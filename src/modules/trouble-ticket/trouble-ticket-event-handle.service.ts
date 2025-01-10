import { Injectable } from '@nestjs/common';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { ObjectLiteral } from 'typeorm';
import { TroubleTicketService } from './trouble-ticket.service';
import {
  APP_CONSTANTS,
  APP_PERMISSIONS,
  DROPDOWN_ITEM_IDS,
  GLOBAL_SETTINGS,
  MapTroubleTicketPriorityToPermission,
  UserType,
} from 'src/common/enums/enums';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { UserService } from '../user/user.service';
import { ReturnTroubleTicketModel } from 'src/models/trouble-ticket.model';
import { SubDepartmentService } from '../sub-department/sub-department.service';
import { AppNotificationQueueService } from 'src/microservices/queues/app-notification-queue/app_notification-queue.service';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { SendMailModel } from 'src/models/send-mail.model';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserModel, FetchUserModel } from 'src/models/user.model';
import { SmsQueueService } from 'src/microservices/queues/sms-queue/sms-queue.service';
import { NotificationPayloadModel } from 'src/models/notification.model';
import { GlobalSettingsService } from '../global-settings/global-settings.service';
import { USerSubDepartmentMappingService } from '../user_subdepartment_mapping/user_subdepartment_mapping.service';

const configService = new EnvironmentConfigService(new ConfigService());

@Injectable()
export class TroubleTicketEventHandleService {
  constructor(
    private readonly troubleTicketService: TroubleTicketService,
    private readonly activityLogService: ActivityLogService,
    private readonly userService: UserService,
    private readonly subDepartmentService: SubDepartmentService,
    private readonly appNotificationQueueService: AppNotificationQueueService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly emailQueueService: EmailQueueService,
    private readonly smsQueueService: SmsQueueService,
    private readonly globalSettingsService: GlobalSettingsService,
    private readonly userSubDepartmentMappingService: USerSubDepartmentMappingService,
  ) {}

  async updateEventHandle(
    entity: TroubleTicket,
    databaseEntity: TroubleTicket,
  ) {
    const troubleTicket = entity;
    if (entity.message !== databaseEntity.message) {
      const payload = {
        related_id: troubleTicket.id,
        related_table: 'activity_log',
        message: troubleTicket.message,
        created_by: troubleTicket.updated_by || troubleTicket.created_by,
      };

      await this.activityLogService.create(payload);

      if (troubleTicket.assigned_to_id) {
        const todUser = await this.userService.getUserById(
          troubleTicket.assigned_to_id,
        );
        if (todUser.id !== troubleTicket.assigned_from_id) {
          // sendSms
          const route = `${configService.getTroubleTicketNotificationRoute()}/${
            troubleTicket.id
          }`;

          const link = `${configService.getWebBaseUrl()}${configService.getTroubleTicketNotificationRoute()}/${
            troubleTicket.id
          }`;
          await this.sendSMS(todUser, troubleTicket, link);

          //Handle Notification

          const notificationMessage = {
            message: troubleTicket.message,
            title: troubleTicket.message_title,
          };
          await this.sendNotifications(
            todUser,
            troubleTicket,
            notificationMessage,
            route,
            link,
          );

          //Handle Email

          const troubleTicketDetail =
            await this.troubleTicketService.getTroubleTicketById(
              troubleTicket.id,
            );
          const title =
            'Ticket has been assigned to you and needs your response.';

          const subject = `Ticket Alert: ${troubleTicketDetail.ticket_number} | ${troubleTicketDetail.currentStatus.label}`;
          const permission =
            MapTroubleTicketPriorityToPermission[troubleTicket.priority_level];

          this.sendEmails(
            troubleTicketDetail,
            todUser,
            title,
            subject,
            permission,
          );
        }
      }
    }
  }

  async insertEventHandle(entity: TroubleTicket) {
    const troubleTicket = entity;
    const todUser = await this.userService.getUserById(
      troubleTicket.assigned_to_id,
    );

    const findUser = await this.userService.getUserById(
      troubleTicket.created_by,
    );

    //Handle Notifications
    const relation = ['users'];
    const subDepartmentDetail = await this.subDepartmentService.findByCondition(
      {
        id: troubleTicket.sub_department_id,
      },
      null,
      relation,
    );

    if (troubleTicket.assigned_to_id) {
      const notificationMessage = {
        message: troubleTicket.message,
        title: troubleTicket.message_title,
      };
      const route = `${configService.getTroubleTicketNotificationRoute()}/${
        troubleTicket.id
      }`;

      const link = `${configService.getWebBaseUrl()}${configService.getTroubleTicketNotificationRoute()}/${
        troubleTicket.id
      }`;
      await this.sendNotifications(
        todUser,
        troubleTicket,
        notificationMessage,
        route,
        link,
      );
    }

    return troubleTicket;
  }

  async troubleTicketPermission(
    currentUser: any,
    ttData: ReturnTroubleTicketModel,
  ) {
    const permissions = {
      can_pull: false,
      can_leave_ticket: false,
      can_update_ticket: false,
      can_reopen_ticket: false,
      can_complete_ticket: false,
      can_request_ticket_pause: false,
      can_resolve_ticket: false,
      can_assign_ticket: false,
      can_sent_back: false,
      can_cancel: false,
      can_request_rca: false,
      can_submit_rca: false,
      can_pause: false,
      can_resume: false,
      can_approve_pause: false,
      can_cancel_pause: false,
      can_change_priority: false,
    };

    const createdTicketUser = await this.userService.getUserById(
      ttData.created_by,
    );

    const toUser = await this.userService.getUserById(ttData.assigned_to_id);

    if (ttData.status === APP_CONSTANTS.troubleTicketStatus.PENDING) {
      if (
        createdTicketUser.sub_department_id === currentUser.sub_department_id
      ) {
        permissions.can_leave_ticket = false;
        permissions.can_update_ticket = false;
        permissions.can_resolve_ticket = false;
        permissions.can_sent_back = false;
        permissions.can_complete_ticket = false;
        permissions.can_assign_ticket = false;
        permissions.can_request_ticket_pause = false;
        permissions.can_pull = true;
        permissions.can_reopen_ticket = false;
        permissions.can_cancel = true;
        permissions.can_request_rca = false;
        permissions.can_approve_pause = false;
        permissions.can_cancel_pause = false;
        permissions.can_change_priority = true;
      }

      return permissions;
    }
    if (ttData.status === APP_CONSTANTS.troubleTicketStatus.ASSIGNED) {
      if (
        currentUser.id === ttData.assigned_to_id &&
        createdTicketUser.sub_department_id !== currentUser.sub_department_id
      ) {
        permissions.can_leave_ticket = true;
        permissions.can_update_ticket = true;
        permissions.can_resolve_ticket = true;
        permissions.can_sent_back = true;
        permissions.can_complete_ticket = false;
        permissions.can_assign_ticket = true;
        permissions.can_request_ticket_pause = false;
        permissions.can_pull = false;
        permissions.can_reopen_ticket = false;
        permissions.can_cancel = false;
        permissions.can_request_rca = false;
        permissions.can_resume = false;
        permissions.can_pause = true;
        permissions.can_approve_pause = false;
        permissions.can_cancel_pause = false;
        permissions.can_change_priority = false;

        return permissions;
      }

      if (
        createdTicketUser.sub_department_id === currentUser.sub_department_id &&
        ttData.is_assigned
      ) {
        permissions.can_leave_ticket = true;
        permissions.can_update_ticket = true;
        permissions.can_resolve_ticket = true;
        permissions.can_sent_back = true;
        permissions.can_complete_ticket = false;
        permissions.can_assign_ticket = true;
        permissions.can_request_ticket_pause = false;
        permissions.can_pull = false;
        permissions.can_reopen_ticket = false;
        permissions.can_cancel = true;
        permissions.can_request_rca = false;
        permissions.can_resume = false;
        permissions.can_pause = true;
        permissions.can_approve_pause = false;
        permissions.can_cancel_pause = false;
        permissions.can_change_priority = true;

        if (ttData.currentTicketPause?.is_approved === false) {
          permissions.can_approve_pause = true;
          permissions.can_cancel_pause = true;
          permissions.can_pause = false;
          permissions.can_leave_ticket = true;
          permissions.can_update_ticket = false;
          permissions.can_resolve_ticket = false;
          permissions.can_sent_back = false;
          permissions.can_complete_ticket = false;
          permissions.can_assign_ticket = false;
          permissions.can_request_ticket_pause = false;
          permissions.can_pull = false;
          permissions.can_reopen_ticket = false;
          permissions.can_cancel = false;
          permissions.can_request_rca = false;
          permissions.can_resume = false;
        }

        return permissions;
      }
    }
    if (
      ttData.status === APP_CONSTANTS.troubleTicketStatus.RESOLVED ||
      ttData.status === DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RCA_AWAITED
    ) {
      if (
        currentUser.id === ttData.assigned_to_id &&
        createdTicketUser.sub_department_id !== currentUser.sub_department_id
      ) {
        permissions.can_leave_ticket = true;
        permissions.can_update_ticket = true;
        permissions.can_resolve_ticket = false;
        permissions.can_sent_back = true;
        permissions.can_complete_ticket = false;
        permissions.can_assign_ticket = false;
        permissions.can_request_ticket_pause = false;
        permissions.can_pull = false;
        permissions.can_reopen_ticket = false;
        permissions.can_cancel = false;
        permissions.can_request_rca = false;
        permissions.can_resume = false;
        permissions.can_pause = false;
        permissions.can_approve_pause = false;
        permissions.can_cancel_pause = false;
        permissions.can_change_priority = false;

        if (ttData.is_rca_required) {
          permissions.can_submit_rca = true;
        }

        if (ttData.rca_submitted) {
          permissions.can_submit_rca = false;
        }

        if (ttData.is_rca_awaited) {
          permissions.can_submit_rca = true;
        }

        return permissions;
      }

      if (
        createdTicketUser.sub_department_id === currentUser.sub_department_id
      ) {
        if (ttData.is_assigned) {
          permissions.can_leave_ticket = true;
          permissions.can_update_ticket = true;
          permissions.can_resolve_ticket = false;
          permissions.can_sent_back = false;
          permissions.can_complete_ticket = true;
          permissions.can_assign_ticket = false;
          permissions.can_request_ticket_pause = false;
          permissions.can_pull = false;
          permissions.can_reopen_ticket = true;
          permissions.can_cancel = true;
          permissions.can_request_rca = false;
          permissions.can_resume = false;
          permissions.can_pause = false;
          permissions.can_approve_pause = false;
          permissions.can_cancel_pause = false;
          permissions.can_submit_rca = false;
          permissions.can_change_priority = false;

          if (!ttData.is_rca_required) {
            permissions.can_request_rca = true;
            permissions.can_submit_rca = false;
          }

          if (ttData.is_rca_awaited) {
            permissions.can_request_rca = false;
            permissions.can_submit_rca = true;
          }

          if (ttData.is_rca_required) {
            permissions.can_request_rca = false;
            permissions.can_submit_rca = true;
            permissions.can_reopen_ticket = false;
          }

          if (ttData.rca_submitted) {
            permissions.can_submit_rca = false;
            permissions.can_request_rca = false;
            permissions.can_reopen_ticket = false;
          }
        }
        if (!ttData.is_assigned) {
          permissions.can_cancel = true;
          permissions.can_pull = true;
        }
        return permissions;
      }
    }

    if (ttData.status === APP_CONSTANTS.troubleTicketStatus.RE_OPEN) {
      if (
        currentUser.id === ttData.assigned_to_id &&
        createdTicketUser.sub_department_id !== currentUser.sub_department_id
      ) {
        permissions.can_leave_ticket = true;
        permissions.can_update_ticket = true;
        permissions.can_resolve_ticket = true;
        permissions.can_sent_back = true;
        permissions.can_complete_ticket = false;
        permissions.can_assign_ticket = false;
        permissions.can_request_ticket_pause = false;
        permissions.can_pull = false;
        permissions.can_reopen_ticket = false;
        permissions.can_cancel = false;
        permissions.can_request_rca = false;
        permissions.can_resume = false;
        permissions.can_pause = true;
        permissions.can_approve_pause = false;
        permissions.can_cancel_pause = false;
        permissions.can_change_priority = false;

        return permissions;
      }

      if (
        createdTicketUser.sub_department_id === currentUser.sub_department_id
      ) {
        if (ttData.is_assigned) {
          permissions.can_leave_ticket = true;
          permissions.can_update_ticket = true;
          permissions.can_resolve_ticket = true;
          permissions.can_sent_back = false;
          permissions.can_complete_ticket = false;
          permissions.can_assign_ticket = true;
          permissions.can_request_ticket_pause = false;
          permissions.can_pull = false;
          permissions.can_reopen_ticket = false;
          permissions.can_cancel = true;
          permissions.can_request_rca = false;
          permissions.can_resume = false;
          permissions.can_pause = true;
          permissions.can_approve_pause = false;
          permissions.can_cancel_pause = false;
          permissions.can_change_priority = false;

          if (ttData.currentTicketPause?.is_approved === false) {
            permissions.can_approve_pause = true;
            permissions.can_cancel_pause = true;
            permissions.can_pause = false;
            permissions.can_leave_ticket = true;
            permissions.can_update_ticket = false;
            permissions.can_resolve_ticket = false;
            permissions.can_sent_back = false;
            permissions.can_complete_ticket = false;
            permissions.can_assign_ticket = false;
            permissions.can_request_ticket_pause = false;
            permissions.can_pull = false;
            permissions.can_reopen_ticket = false;
            permissions.can_cancel = false;
            permissions.can_request_rca = false;
            permissions.can_resume = false;
          }
        }
        if (!ttData.is_assigned) {
          permissions.can_cancel = true;
          permissions.can_pull = false;
        }

        return permissions;
      }
    }

    if (ttData.status === APP_CONSTANTS.troubleTicketStatus.COMPLETED) {
      permissions.can_leave_ticket = false;
      permissions.can_update_ticket = false;
      permissions.can_resolve_ticket = false;
      permissions.can_sent_back = false;
      permissions.can_complete_ticket = false;
      permissions.can_assign_ticket = false;
      permissions.can_request_ticket_pause = false;
      permissions.can_pull = false;
      permissions.can_reopen_ticket = false;
      permissions.can_cancel = false;
      permissions.can_request_rca = false;
      permissions.can_resume = false;
      permissions.can_pause = false;
      permissions.can_approve_pause = false;
      permissions.can_cancel_pause = false;
      permissions.can_change_priority = false;

      return permissions;
    }

    if (ttData.status === DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.Pause) {
      permissions.can_leave_ticket = false;
      permissions.can_update_ticket = false;
      permissions.can_resolve_ticket = false;
      permissions.can_sent_back = false;
      permissions.can_complete_ticket = false;
      permissions.can_assign_ticket = false;
      permissions.can_request_ticket_pause = false;
      permissions.can_pull = false;
      permissions.can_reopen_ticket = false;
      permissions.can_cancel = false;
      permissions.can_request_rca = false;
      permissions.can_resume = false;
      permissions.can_pause = false;
      permissions.can_approve_pause = false;
      permissions.can_cancel_pause = false;
      permissions.can_change_priority = false;

      if (
        createdTicketUser.sub_department_id === currentUser.sub_department_id
      ) {
        permissions.can_resume = true;
        // permissions.can_approve_pause = true;
      }
    }
  }

  async sendEmails(
    troubleTicketDetail: ReturnTroubleTicketModel,
    toUser: FetchUserModel | CreateUserModel,
    title: string,
    subject: string,
    permission: string,
  ) {
    let ccEmail = [];
    const settings = await this.checkSettings(
      {
        condition_value: toUser.id,
        key: GLOBAL_SETTINGS.KEYS.RECEIVE_EMAIL,
      },
      GLOBAL_SETTINGS.TYPES.USER_NOTIFICATION,
    );

    //set owner Email in cc if ticket assign to other users
    const ownerGroup = await this.userService.findGroupUserBySubDepartment(
      troubleTicketDetail.createdByUser.sub_department,
      troubleTicketDetail?.region_id ? [troubleTicketDetail?.region_id] : null,
    );
    if (ownerGroup.sub_department_id !== toUser.sub_department_id) {
      ccEmail = [...ccEmail, ownerGroup.email];
    }
    const troubleTicketRegions = { regionId: troubleTicketDetail.region_id };
    //  await this.userSubDepartmentMappingService.getMappedSubDepartmentUsers(
    //    troubleTicketDetail.sub_department_id,
    //    permission,
    //  );
    const priorityLevelUsersEmails =
      await this.userSubDepartmentMappingService.getUserEmailsBySubDeptAndPermission(
        troubleTicketDetail.sub_department_id,
        permission,
      );

    if (priorityLevelUsersEmails)
      ccEmail = [...ccEmail, ...priorityLevelUsersEmails];

    //remove duplication of Emails
    ccEmail = Array.from(new Set([...ccEmail]));

    //check if email setting enable and region exists
    if (
      +settings.receive_email &&
      (toUser.regions?.some((r) => r.id === troubleTicketRegions?.regionId) ||
        !troubleTicketRegions.regionId)
    ) {
      let sendMailModel: SendMailModel = {
        to: '',
        subject: '',
        cc: [],
        template: '',
        context: '',
        attachments: [],
        html: '',
      };

      sendMailModel.html =
        await this.emailTemplatesService.getTroubleTicketEmailTemplate(
          troubleTicketDetail,
          title,
          toUser,
        );
      sendMailModel = {
        ...sendMailModel,
        to: toUser.email,
        subject: subject,
        cc: ccEmail,
      };

      await this.emailQueueService.addJobInQueue({
        ...sendMailModel,
      });
    }
  }

  async sendNotifications(
    todUser: FetchUserModel,
    troubleTicket: any,
    notificationMessage: {
      message: string;
      title: string;
    },
    route: string,
    link: string,
  ) {
    const transformPayload = (user: number): NotificationPayloadModel => ({
      related_id: troubleTicket.id,
      related_table: 'trouble_ticket',
      message: notificationMessage.message,
      title: notificationMessage.title,
      user_id: user,
      sub_department_id: troubleTicket.sub_department_id,
      is_seen: false,
      is_open: false,
      created_by: troubleTicket.updated_by || troubleTicket.created_by,
      route: route,
      link: link,
    });

    let getUsers = await this.handlePermissions(todUser, troubleTicket);

    // add job in queue
    if (getUsers) {
      for (let user of getUsers) {
        const settings = await this.checkSettings(
          {
            condition_value: user.id,
            key: GLOBAL_SETTINGS.KEYS.RECEIVE_NOTIFICATION,
          },
          GLOBAL_SETTINGS.TYPES.USER_NOTIFICATION,
        );
        if (+settings.receive_notification) {
          const payload: NotificationPayloadModel = transformPayload(user.id);
          const notificationPayload = {
            payload,
          };
          await this.appNotificationQueueService.addJobInQueue(
            notificationPayload,
          );
        }
      }
    }
  }

  async sendSMS(todUser: any, troubleTicket: ObjectLiteral, link: string) {
    //const click_here = `<a href='${link}'>click_here</a>`;
    const click_here = link;
    let getUsers = await this.handlePermissions(todUser, troubleTicket);
    const message =
      APP_CONSTANTS.SMS.MESSAGES.TROUBLE_TICKET_MESSAGE.ASSIGNED_TO_SUB(
        troubleTicket.ticket_number,
        todUser.sub_department,
        click_here,
      );
    //add job in queue
    if (getUsers) {
      for (let user of getUsers) {
        const settings = await this.checkSettings(
          {
            condition_value: user.id,
            key: GLOBAL_SETTINGS.KEYS.RECEIVE_SMS,
          },
          GLOBAL_SETTINGS.TYPES.USER_NOTIFICATION,
        );
        if (+settings?.receive_sms) {
          const smsPayload = {
            to: user.official_mobile,
            message: message,
          };
          await this.smsQueueService.addJobInQueue(smsPayload);
        }
      }
    }
  }

  async checkSettings(query, id: number) {
    let getSetting: getSettingInterface =
      await this.globalSettingsService.findSingleSetting(query, id);

    if (Object.keys(getSetting).length === 0) {
      return (getSetting = { [query.key]: '1' });
    }
    return getSetting;
  }

  async handlePermissions(
    todUser: FetchUserModel,
    ticket: any,
  ): Promise<any[]> {
    const troubleTicketRegions = { regionId: ticket.region_id };
    if (
      todUser.user_type === UserType.EMPLOYEE &&
      (todUser.regions?.some((r) => r.id === troubleTicketRegions?.regionId) ||
        !troubleTicketRegions.regionId) &&
      todUser.permissions?.some(
        (per) => per.name === APP_PERMISSIONS.TROUBLE_TICKET.ACCESS,
      )
    ) {
      return [todUser];
    }

    if (todUser?.user_type === UserType.GROUP) {
      const users = await this.userService.getAllByCondition({
        sub_department_id: todUser.sub_department_id,
        user_type: UserType.EMPLOYEE,
      });
      let userArray = [];
      for (let user of users) {
        if (
          user.roles?.some((role) => {
            return role.permissions?.some(
              (per) => per.name === APP_PERMISSIONS.TROUBLE_TICKET.ACCESS,
            );
          }) &&
          (user.regions?.some((r) => r.id === troubleTicketRegions?.regionId) ||
            !troubleTicketRegions.regionId)
        ) {
          userArray = [...userArray, user];
        }
      }

      return userArray;
    }
  }
}

interface getSettingInterface {
  receive_email?: string;
  receive_sms?: string;
  receive_notification?: string;
}
