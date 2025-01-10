import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TroubleTicketMediumService } from './trouble-ticket-medium.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tt-medium')
@UseGuards(AuthGuard())
export class TroubleTicketMediumController {
  constructor(
    private readonly troubleTicketMediumService: TroubleTicketMediumService,
  ) {}

  @Post()
  async createTroubleTicketMedium(@Body() body: any) {
    return this.troubleTicketMediumService.create(body);
  }
}
