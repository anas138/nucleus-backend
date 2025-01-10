import { Module } from '@nestjs/common';
import { AlarmFilterEscalationDeviceService } from './alarm-flter-escalation-device.service';
import { AlarmFilterEscalationFilterDeviceRepository } from './alarm-flter-escalation-device.repositroy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmFilterEscalationDevice } from 'src/entities/alarm-filter-escalation-device.entity';
import { AlarmFilterEscalationDeviceController } from './alarm-flter-escalation-device.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmFilterEscalationDevice])],
  controllers: [AlarmFilterEscalationDeviceController],
  providers: [
    AlarmFilterEscalationDeviceService,
    AlarmFilterEscalationFilterDeviceRepository,
  ],
  exports: [
    AlarmFilterEscalationDeviceService,
    AlarmFilterEscalationFilterDeviceRepository,
  ],
})
export class AlarmFilterEscalationDeviceModule {}
