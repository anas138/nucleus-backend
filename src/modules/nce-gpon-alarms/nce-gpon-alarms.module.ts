import { Module, forwardRef } from '@nestjs/common';
import { NceGponAlarmsService } from './nce-gpon-alarms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { NCEGponAlarmsRepository } from './nce-alarms.repository';
import { NceGponAlarmsController } from './nce-gpon-alarms.controller';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { SharedModule } from '../shared/shared.module';
import { EmailQueueModule } from 'src/microservices/queues/email-queue/email-queue.module';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { AlarmFilterConfigModule } from '../alarm-filter-config/alarm-filter-config.module';
import { NceGponAlarm } from 'src/entities/nce-gpon-alarm.entity';

const queue = [
  BullModule.registerQueue({
    name: QUEUES.EMAIL_QUEUE,
  }),
];

@Module({
  imports: [
    ...queue,
    TypeOrmModule.forFeature([NceGponAlarm]),
    SharedModule,
    EmailQueueModule,
    forwardRef(() => AlarmFilterConfigModule),
  ],
  providers: [
    NceGponAlarmsService,
    NCEGponAlarmsRepository,
    HelperFunctions,
    EmailQueueService,
    EmailTemplatesService,
  ],
  controllers: [NceGponAlarmsController],
  exports: [NceGponAlarmsService],
})
export class NceGponAlarmsModule {}
