import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { QUEUES } from 'src/common/enums/enums';
import { AlarmDelayedActionsService } from './alarm-delayed-actions.service';
import { AlarmDelayedActionsProcess } from './alarm-delayed-actions.process';
import { ObsAlertsModule } from 'src/modules/obs-alerts/obs-alerts.module';
import { NceAlarmsModule } from 'src/modules/nce-alarms/nce-alarms.module';
import { AlarmFilterConfigModule } from 'src/modules/alarm-filter-config/alarm-filter-config.module';
import { EmailService } from './email-service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { EscalateTroubleTicketService } from './escalate-trouble-ticket-service';
import { TroubleTicketModule } from 'src/modules/trouble-ticket/trouble-ticket.module';
import { UserModule } from 'src/modules/user/user.module';
import { SubDepartmentModule } from 'src/modules/sub-department/sub-department.module';
import { NceGponAlarmsModule } from 'src/modules/nce-gpon-alarms/nce-gpon-alarms.module';
import { NokiaTxnAlarmsModule } from 'src/modules/nokia-txn-alarms/nokia-txn-alarms.module';
import { LdiSoftSwitchAlarmModule } from 'src/modules/ldi-softswitch-alarm/ldi-softswitch-alarm.module';

const queue = [
  BullModule.registerQueue({
    name: QUEUES.ALARMS_DELAYED_ACTIONS_QUEUE,
  }),
];
@Module({
  imports: [
    ...queue,
    UserModule,
    SubDepartmentModule,
    forwardRef(() => ObsAlertsModule),
    forwardRef(() => TroubleTicketModule),
    forwardRef(() => NceAlarmsModule),
    forwardRef(() => NceGponAlarmsModule),
    forwardRef(() => NokiaTxnAlarmsModule),
    forwardRef(() => LdiSoftSwitchAlarmModule),
    forwardRef(() => AlarmFilterConfigModule),
  ],
  providers: [
    AlarmDelayedActionsService,
    AlarmDelayedActionsProcess,
    EmailService,
    EnvironmentConfigService,
    EscalateTroubleTicketService,
  ],
  exports: [AlarmDelayedActionsService],
})
export class AlarmDelayedActionsModule {}
