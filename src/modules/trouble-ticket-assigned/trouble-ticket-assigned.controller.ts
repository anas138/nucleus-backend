import { Body, Controller, Post } from '@nestjs/common';
import { TroubleTicketAssignedService } from './trouble-ticket-assigned.service';
import { CreateTroubleTicketAssignedDto } from 'src/dto/trouble-ticket-assigned/create-trouble-ticket-assigned.dto';

@Controller('tt-assigned')
export class TroubleTicketAssignedController {
  constructor(
    private readonly troubleTicketAssignedService: TroubleTicketAssignedService,
  ) {}

  @Post()
  async createTroubleTicketAssigned(
    @Body() body: CreateTroubleTicketAssignedDto,
  ) {
    return this.troubleTicketAssignedService.create(body);
  }
}
