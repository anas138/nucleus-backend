import { forwardRef, Module } from '@nestjs/common';
import { LdiSoftSwitchAlarmController } from './ldi-softswitch-alarm.controller';
import { LdiSoftSwitchAlarmRepository } from './ldi-softswitch-alarm.repository';
import { LdiSoftSwitchAlarmService } from './ldi-softswitch-alarm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LdiSoftswitchEmsAlarm } from 'src/entities/ldi-softswitch-alarm.entity';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { SharedModule } from '../shared/shared.module';
import { EmailQueueModule } from 'src/microservices/queues/email-queue/email-queue.module';
import { AlarmFilterConfigModule } from '../alarm-filter-config/alarm-filter-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LdiSoftswitchEmsAlarm]),
    SharedModule,
    EmailQueueModule,
    forwardRef(() => AlarmFilterConfigModule),
  ],
  controllers: [LdiSoftSwitchAlarmController],
  providers: [
    LdiSoftSwitchAlarmRepository,
    LdiSoftSwitchAlarmService,
    HelperFunctions,
    EmailTemplatesService,
  ],
  exports: [LdiSoftSwitchAlarmRepository, LdiSoftSwitchAlarmService],
})
export class LdiSoftSwitchAlarmModule {}
