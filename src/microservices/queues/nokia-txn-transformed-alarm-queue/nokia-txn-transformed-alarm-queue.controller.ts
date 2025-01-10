import { Body, Controller, Post } from '@nestjs/common';
import { NokiaTxnTransformedAlarmsQueueService } from './nokia-txn-transformed-alarm-queue.service';

@Controller('nokia-txn-queue')
export class NokiaTxnQueueController {
  constructor(
    private readonly nokiaTxnTransformedAlarmsQueueService: NokiaTxnTransformedAlarmsQueueService,
  ) {}
  @Post()
  async createQueueAlarm(@Body() body: any) {
    return this.nokiaTxnTransformedAlarmsQueueService.addJobInQueue(body);
  }
}
