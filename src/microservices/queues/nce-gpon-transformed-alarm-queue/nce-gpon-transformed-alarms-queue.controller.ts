import { Body, Controller, Post } from '@nestjs/common';
import { NceGponTransformedAlarmsQueueService } from './nce-gpon-transformed-alarms-queue.service';

@Controller('nce-gpon-queue')
export class NceGponQueueController {
  constructor(
    private readonly nceGponTransformedAlarmsQueueService: NceGponTransformedAlarmsQueueService,
  ) {}
  @Post()
  async createQueueAlarm(@Body() body: any) {
    return this.nceGponTransformedAlarmsQueueService.addJobInQueue(body);
  }
}
