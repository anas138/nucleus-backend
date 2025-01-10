import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccumulatedTroubleTicketService } from './accumulated-trouble-ticket.service';

@Controller('accumulated-ticket')
export class AccumulatedTroubleTicketController {
  constructor(
    private accumulatedTroubleTicketService: AccumulatedTroubleTicketService,
  ) {}

  @Post('/')
  async createTicketAccumulation(@Body() body: any) {
    return this.accumulatedTroubleTicketService.create(body);
  }
  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.accumulatedTroubleTicketService.findAll({
      where: { ticket_id: id },
      relations: [
        'alarmFilterConfig',
        'observiumAlert',
        'currentStatus',
        'troubleTicket',
      ],
    });
  }
}
