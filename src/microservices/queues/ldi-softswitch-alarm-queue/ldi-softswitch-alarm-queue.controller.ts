import { Body, Controller, Post } from '@nestjs/common';
import { LdiSoftswitchTransformedAlarmsQueueService } from './ldi-softswitch-alarm-queue.service';

@Controller('ldi-softswitch-alarm-queue')
export class NokiaTxnQueueController {
  constructor(
    private readonly nokiaTxnTransformedAlarmsQueueService: LdiSoftswitchTransformedAlarmsQueueService,
  ) {}
  @Post()
  async createQueueAlarm(@Body() body: any) {
    return this.nokiaTxnTransformedAlarmsQueueService.addJobInQueue(body);
  }
}
