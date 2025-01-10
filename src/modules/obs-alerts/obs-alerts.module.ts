import { Module, forwardRef } from '@nestjs/common';
import { ObsAlertsController } from './obs-alerts.controller';
import { ObsAlertsService } from './obs-alerts.service';
import { ObsAlertsRepository } from './obs-alerts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObserviumAlert } from 'src/entities/obs-alert.entity';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { SharedModule } from '../shared/shared.module';
import { EmailQueueModule } from 'src/microservices/queues/email-queue/email-queue.module';
import { EmailTemplatesService } from '../shared/email-templates.service';
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
    TypeOrmModule.forFeature([ObserviumAlert]),
    SharedModule,
    EmailQueueModule,
    forwardRef(() => AlarmFilterConfigModule),
  ],
  controllers: [ObsAlertsController],
  providers: [
    ObsAlertsService,
    ObsAlertsRepository,
    HelperFunctions,
    EmailQueueService,
    EmailTemplatesService,
  ],
  exports: [ObsAlertsService],
})
export class ObsAlertsModule {}
