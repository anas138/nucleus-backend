import { Module, forwardRef } from '@nestjs/common';
import { NceAlarmsService } from './nce-alarms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NceAlarm } from 'src/entities/nce-alarm.entity';
import { NCEAlarmsRepository } from './nce-alarms.repository';
import { NceAlarmsController } from './nc-alarms.controller';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { SharedModule } from '../shared/shared.module';
import { EmailQueueModule } from 'src/microservices/queues/email-queue/email-queue.module';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/enums/enums';
import { AlarmFilterConfigModule } from '../alarm-filter-config/alarm-filter-config.module';

const queue = [
  BullModule.registerQueue({
    name: QUEUES.EMAIL_QUEUE,
  }),
];

@Module({
  imports: [
    ...queue,
    TypeOrmModule.forFeature([NceAlarm]),
    SharedModule,
    EmailQueueModule,
    forwardRef(() => AlarmFilterConfigModule),
  ],
  providers: [
    NceAlarmsService,
    NCEAlarmsRepository,
    HelperFunctions,
    EmailQueueService,
    EmailTemplatesService,
  ],
  controllers: [NceAlarmsController],
  exports: [NceAlarmsService],
})
export class NceAlarmsModule {}
