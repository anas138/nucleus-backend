import { Module, forwardRef } from '@nestjs/common';
import { TroubleTicketRepository } from './trouble-ticket.repository';
import { TroubleTicketController } from './trouble-ticket.controller';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TroubleTicketService } from './trouble-ticket.service';
import { DropDownModule } from '../drop-down/drop-down.module';
import { TroubleTicketStatusLogModule } from '../trouble-ticket-status-log/trouble-ticket-status-log.module';
import { UserModule } from '../user/user.module';
import { TroubleTicketAssignedModule } from '../trouble-ticket-assigned/trouble-ticket-assigned.module';
import { TroubleTicketEventHandleService } from './trouble-ticket-event-handle.service';
import { ActivityLogModule } from '../activity-log/activity.log.module';
import { CommentLogModule } from '../comment-log/comment-log.module';
import { TroubleTicketCategoryModule } from '../trouble-ticket-category/trouble-ticket-category.module';
import { AlarmFilterConfigModule } from '../alarm-filter-config/alarm-filter-config.module';
import { NceAlarmsModule } from '../nce-alarms/nce-alarms.module';
import { ObsAlertsModule } from '../obs-alerts/obs-alerts.module';
import { SubDepartmentModule } from '../sub-department/sub-department.module';
import { AppNotificationModule } from '../app_notification/app_notification.module';

import { AppNotificationQueueModule } from 'src/microservices/queues/app-notification-queue/app_notification-queue.module';
import { EmailQueueModule } from 'src/microservices/queues/email-queue/email-queue.module';
import { UploadModule } from '../upload/upload.module';
import { SmsQueueModule } from 'src/microservices/queues/sms-queue/sms-queue.module';
import { GlobalSettingsModule } from '../global-settings/global-settings.module';
import { TroubleTicketPauseModule } from '../trouble-ticket-pause/trouble-ticket-pause.module';
import { PauseTicketQueueModule } from 'src/microservices/queues/pause-ticket/pause-ticket.module';
import { AccumulatedTroubleTicketModule } from '../accumulated-trouble-ticket/accumulated-trouble-ticket.module';

import { RegionModule } from '../region/region.module';
import { CacheManagerModule } from 'src/common/cache/cache-manager.module';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';
import { UserSubDepartmentMappingModule } from '../user_subdepartment_mapping/user_subdepartment_mapping.module';
import { TroubleTicketHelperService } from './trouble-ticket-helper.service';
import { TroubleTicketOverTatQueueModule } from 'src/microservices/queues/trouble-ticket-overTAT-queue/trouble-ticket-overTAT.module';
import { NceGponAlarmsModule } from '../nce-gpon-alarms/nce-gpon-alarms.module';
import { NokiaTxnAlarmsModule } from '../nokia-txn-alarms/nokia-txn-alarms.module';
import { LdiSoftSwitchAlarmModule } from '../ldi-softswitch-alarm/ldi-softswitch-alarm.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([TroubleTicket]),
    DropDownModule,
    TroubleTicketStatusLogModule,
    UserModule,
    TroubleTicketAssignedModule,
    ActivityLogModule,
    CommentLogModule,
    TroubleTicketCategoryModule,
    forwardRef(() => AlarmFilterConfigModule),
    forwardRef(() => ObsAlertsModule),
    forwardRef(() => NceAlarmsModule),
    SubDepartmentModule,
    AppNotificationModule,
    AppNotificationQueueModule,
    EmailQueueModule,
    UploadModule,
    SmsQueueModule,
    GlobalSettingsModule,
    AccumulatedTroubleTicketModule,
    RegionModule,
    CacheManagerModule,
    UserSubDepartmentMappingModule,
    forwardRef(() => TroubleTicketOverTatQueueModule),
    NceGponAlarmsModule,
    NokiaTxnAlarmsModule,
    LdiSoftSwitchAlarmModule,
  ],
  controllers: [TroubleTicketController],
  providers: [
    TroubleTicketRepository,
    TroubleTicketService,
    TroubleTicketEventHandleService,
    CacheManagerService,
    TroubleTicketHelperService,
  ],
  exports: [
    TroubleTicketRepository,
    TroubleTicketService,
    TroubleTicketEventHandleService,
    TroubleTicketHelperService,
  ],
})
export class TroubleTicketModule {}
