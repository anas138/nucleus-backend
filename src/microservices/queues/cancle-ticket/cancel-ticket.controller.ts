import { Body, Controller, Post } from '@nestjs/common';
import { CancelTicketQueueService } from './cancel-ticket.service';

@Controller('cancel-queue')
export class CancelQueueTroubleTicket {
  constructor(
    private readonly cancelTicketQueueService: CancelTicketQueueService,
  ) {}
  @Post('/')
  async cancelQueueTroubleTicket(@Body() alarms: any) {
    return this.cancelTicketQueueService.addJobInQueue(alarms);
  }
}
