import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AlarmFilterEscalationDeviceService } from './alarm-flter-escalation-device.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('escalation-device')
export class AlarmFilterEscalationDeviceController {
  constructor(
    private readonly alarmFilterEscalationDeviceService: AlarmFilterEscalationDeviceService,
  ) {}
  @Get('alarm-filter-config/:id')
  async getDevicesByAlarmConfig(@Param('id') id: number) {
    return this.alarmFilterEscalationDeviceService.getDevicesByAlarmFilterConfig(
      id,
    );
  }
}
