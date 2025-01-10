import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { AlarmFilterConfigController } from './alarm-filter-config.controller';
import { AlarmFilterConfigService } from './alarm-filter-config.service';
import { AlarmFilterConfigRepository } from './alarm-filter-config.repository';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { AlarmFilterAdvanceConditionModule } from '../alarm-filter-advance-condition/alarm-filter-advance-condition.module';
import { AlarmFilterAdvanceCondition } from 'src/entities/alarm-filter-advance-condition.entity';
import { AlarmRecipientModule } from '../alarm-recipient/alarm-recipient.module';
import { NceNetworkElementModule } from '../nce-network-element/nce-network-element.module';
import { UserModule } from '../user/user.module';
import { DropDownModule } from '../drop-down/drop-down.module';
import { AlarmDelayedActionsModule } from 'src/microservices/queues/alarm-delayed-actions/alarm-delayed-actions.module';
import { ObsDeviceModule } from '../obs-device/obs-device.module';
import { AlarmAutomatedActionsService } from './alarm-automated-actions.service';
import { AlarmFilterEscalationDeviceModule } from '../alarm-filter-escalation-device/alarm-flter-escalation-device.module';

import { ObsAlertsModule } from '../obs-alerts/obs-alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlarmFilterConfig, AlarmFilterAdvanceCondition]),
    AlarmFilterAdvanceConditionModule,
    AlarmRecipientModule,
    NceNetworkElementModule,
    ObsDeviceModule,
    UserModule,
    DropDownModule,
    AlarmDelayedActionsModule,
    AlarmFilterEscalationDeviceModule,
  ],
  controllers: [AlarmFilterConfigController],
  providers: [
    AlarmFilterConfigService,
    AlarmFilterConfigRepository,
    AlarmAutomatedActionsService,
    HelperFunctions,
  ],
  exports: [AlarmFilterConfigService, AlarmAutomatedActionsService],
})
export class AlarmFilterConfigModule {}
