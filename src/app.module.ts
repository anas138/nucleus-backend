import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroservicesModule } from './microservices/microservices.module';
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { PassportJwtModule } from './adapter/passport-jwt/passport-jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentConfigModule } from './config/environment-config/environment-config.module';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';
import { SeedModule } from './database/seed/seed.module';
import { RegionModule } from './modules/region/region.module';
import { SegmentModule } from './modules/segment/segment.module';
import { DepartmentModule } from './modules/department/department.module';
import { SubDepartmentModule } from './modules/sub-department/sub-department.module';
import { DesignationModule } from './modules/designation/designation.module';
import { CacheManagerModule } from './common/cache/cache-manager.module';
import { UploadModule } from './modules/upload/upload.module';
import { ObsAlertsModule } from './modules/obs-alerts/obs-alerts.module';
import { ObsDeviceModule } from './modules/obs-device/obs-device.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CityModule } from './modules/city/city.module';
import { CountryModule } from './modules/country/country.module';
import { ProvinceModule } from './modules/province/province.module';
import { NceNetworkElementModule } from './modules/nce-network-element/nce-network-element.module';
import { AlarmRecipientModule } from './modules/alarm-recipient/alarm-recipient.module';
import { AlarmFilterConfigModule } from './modules/alarm-filter-config/alarm-filter-config.module';
import { AlarmFilterAdvanceConditionModule } from './modules/alarm-filter-advance-condition/alarm-filter-advance-condition.module';
import { NceSubnetModule } from './modules/nce-subnet/nce-subnet.module';
import { GatewayModule } from './microservices/gateways/gateway.module';
import { MailerModule } from './microservices/mailer/mailer.module';
import { DropDownModule } from './modules/drop-down/drop-down.module';
import { EnvironmentConfigService } from './config/environment-config/environment-config.service';
import { EmailQueueModule } from './microservices/queues/email-queue/email-queue.module';
import { SharedModule } from './modules/shared/shared.module';
import { DashboardStatsModule } from './modules/dashboard-stats/dashboard-stats.module';
import { AlarmDelayedActionsModule } from './microservices/queues/alarm-delayed-actions/alarm-delayed-actions.module';
import { CronModule } from './cron/cron.module';
import { FiltersTemplateModule } from './modules/filters-template/filters-template.module';
import { GlobalSettingsTypesModule } from './modules/global-settings-types/global-settings-types.module';
import { GlobalSettingsModule } from './modules/global-settings/global-settings.module';
import { EmailLogsModule } from './modules/email-logs/email-logs.module';
import { AppDashboardModule } from './modules/app-dashboard/app-dashboard.module';
import { AppDashboardWidgetModule } from './modules/app-dashboard-widget/app-dashboard-widget.module';
import { TroubleTicketCategoryModule } from './modules/trouble-ticket-category/trouble-ticket-category.module';
import { TroubleTicketMediumModule } from './modules/trouble-ticket-medium/trouble-ticket-medium.module';
import { TroubleTicketModule } from './modules/trouble-ticket/trouble-ticket.module';
import { TroubleTicketStatusLogModule } from './modules/trouble-ticket-status-log/trouble-ticket-status-log.module';
import { TroubleTicketAssignedModule } from './modules/trouble-ticket-assigned/trouble-ticket-assigned.module';
import { CommentLogModule } from './modules/comment-log/comment-log.module';
import { EventSubscriberModule } from './modules/event-subscriber/event-subscriber.module';
import { ActivityLogModule } from './modules/activity-log/activity.log.module';
import { AppNotificationModule } from './modules/app_notification/app_notification.module';
import { AppNotificationQueueModule } from './microservices/queues/app-notification-queue/app_notification-queue.module';
import { SmsQueueModule } from './microservices/queues/sms-queue/sms-queue.module';
import { ReportModule } from './modules/report/report.module';
import { CancelTicketQueueModule } from './microservices/queues/cancle-ticket/cancel-ticket.module';
import { TroubleTicketDashboardModule } from './modules/trouble-ticket-dashboard/troublre-ticket-dashboard.module';
import { TroubleTicketPauseModule } from './modules/trouble-ticket-pause/trouble-ticket-pause.module';
import { PauseTicketQueueModule } from './microservices/queues/pause-ticket/pause-ticket.module';
import { AccumulatedTroubleTicketModule } from './modules/accumulated-trouble-ticket/accumulated-trouble-ticket.module';
import { TroubleTicketEventHandlerQueueModule } from './microservices/queues/trouble-ticket-event-handler/trouble-ticket-event-handler.module';
import { MsGraphApiModule } from './modules/ms-graph-api/ms-graph-api.module';
import { AlarmFilterEscalationDeviceModule } from './modules/alarm-filter-escalation-device/alarm-flter-escalation-device.module';
import { UserSubDepartmentMappingModule } from './modules/user_subdepartment_mapping/user_subdepartment_mapping.module';
import { TroubleTicketOverTatQueueModule } from './microservices/queues/trouble-ticket-overTAT-queue/trouble-ticket-overTAT.module';
import { NceGponNetworkElementModule } from './modules/nce-gpon-network-element/nce-gpon-network-element.module';
import { NceGponTransformedAlarmsQueueModule } from './microservices/queues/nce-gpon-transformed-alarm-queue/nce-gpon-transformed-alarms-queue.module';
import { RedisModule } from './common/redis/redis.module';
import { NceGponAlarmsModule } from './modules/nce-gpon-alarms/nce-gpon-alarms.module';
import { NokiaTxnNetworkElementModule } from './modules/nokia-txn-network-element/nokia-txn-network-element.module';
import { NokiaTxnAlarmsModule } from './modules/nokia-txn-alarms/nokia-txn-alarms.module';
import { NokiaTxnTransformedAlarmsQueueModule } from './microservices/queues/nokia-txn-transformed-alarm-queue/nokia-txn-transformed-alarm-queue.module';
import { LdiSoftSwitchTrunkGroupModule } from './modules/ldi-softswitch-trunk-group/ldi-softswitch-trunk-group.module';
import { LdiSoftSwitchAlarmModule } from './modules/ldi-softswitch-alarm/ldi-softswitch-alarm.module';
import { LdiSoftswitchAlarmQueueModule } from './microservices/queues/ldi-softswitch-alarm-queue/ldi-softswitch-alarm-queue.module';
import { ObserviumTransformedAlertsQueueModule } from './microservices/queues/observium-transformed-alerts-queue/observium-transformed-alerts.module';

const configService = new EnvironmentConfigService(new ConfigService());
let modules = [];

const nucleusAppModules = [
  UserModule,
  // PermissionModule, IT will manually perform the curd operations of permissions
  RoleModule,
  TypeOrmConfigModule,
  AuthModule,
  SeedModule,
  PassportJwtModule,
  RegionModule,
  SegmentModule,
  DepartmentModule,
  SubDepartmentModule,
  DesignationModule,
  UploadModule,
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  ObsAlertsModule,
  ObsDeviceModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/uploads',
  }),
  CityModule,
  CountryModule,
  ProvinceModule,
  NceNetworkElementModule,
  AlarmFilterAdvanceConditionModule,
  AlarmFilterConfigModule,
  AlarmRecipientModule,
  NceSubnetModule,
  GatewayModule,
  MailerModule,
  DropDownModule,
  EmailQueueModule,
  SharedModule,
  DashboardStatsModule,
  AlarmDelayedActionsModule,
  CronModule,
  FiltersTemplateModule,
  GlobalSettingsTypesModule,
  GlobalSettingsModule,
  EmailLogsModule,
  AppDashboardModule,
  AppDashboardWidgetModule,
  TroubleTicketCategoryModule,
  TroubleTicketMediumModule,
  TroubleTicketModule,
  TroubleTicketStatusLogModule,
  TroubleTicketAssignedModule,
  CommentLogModule,
  EventSubscriberModule,
  ActivityLogModule,
  AppNotificationModule,
  AppNotificationQueueModule,
  SmsQueueModule,
  ReportModule,
  CancelTicketQueueModule,
  TroubleTicketDashboardModule,
  TroubleTicketPauseModule,
  PauseTicketQueueModule,
  AccumulatedTroubleTicketModule,
  TroubleTicketEventHandlerQueueModule,
  MsGraphApiModule,
  AlarmFilterEscalationDeviceModule,
  UserSubDepartmentMappingModule,
  TroubleTicketOverTatQueueModule,
  NceGponNetworkElementModule,
  NceGponAlarmsModule,
  NceGponTransformedAlarmsQueueModule,
  NokiaTxnNetworkElementModule,
  NokiaTxnAlarmsModule,
  NokiaTxnTransformedAlarmsQueueModule,
  LdiSoftSwitchTrunkGroupModule,
  LdiSoftSwitchAlarmModule,
  LdiSoftswitchAlarmQueueModule,
  ObserviumTransformedAlertsQueueModule,
];
if (configService.getIsNucleusAppEnabled()) {
  modules = [...modules, ...nucleusAppModules];
}

@Module({
  imports: [
    ...modules,
    SharedModule,
    CacheManagerModule,
    RedisModule,
    EnvironmentConfigModule,
    MicroservicesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '/client',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
