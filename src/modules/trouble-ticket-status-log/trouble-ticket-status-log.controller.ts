import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TroubleTicketStatusLogService } from './trouble-ticket-status-log.service';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { AuthGuard } from '@nestjs/passport';

@Controller('tt-status-log')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class TroubleTicketStatusLogController {
  constructor(
    private readonly troubleTicketStatusLogService: TroubleTicketStatusLogService,
  ) {}
  @Post()
  async createTroubleTicketStatusLog(@Body() body: any) {
    return this.troubleTicketStatusLogService.create(body);
  }
  @Get()
  async getStatus() {
    return this.troubleTicketStatusLogService.findAll();
  }

  @Get('/:id')
  async getStatusById(@Param('id') id: number) {
    return this.troubleTicketStatusLogService.getStatusById(id);
  }
}
