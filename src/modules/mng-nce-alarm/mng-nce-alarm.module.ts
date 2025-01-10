import { Module } from '@nestjs/common';
import { MngNceAlarmController } from './mng-nce-alarm.controller';
import { MngNceAlarmsRepository } from './mng-nce-alarm.repository';
import { MngNceAlarmService } from './mng-nce-alarm.service';
import { mngNceAlertsProvider } from './mng-nce-alarm.provider';

import { MongooseConfigModule } from 'src/config/mongoose/mongoose.module';

@Module({
  imports: [MongooseConfigModule],
  controllers: [MngNceAlarmController],
  providers: [
    MngNceAlarmService,
    MngNceAlarmsRepository,
    ...mngNceAlertsProvider,
  ],
  exports: [MngNceAlarmService, MngNceAlarmsRepository],
})
export class MngNceAlarmModule {}
