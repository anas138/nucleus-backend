import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TroubleTicketPauseService } from './trouble-ticket-pause.service';
import { UpdateTroubleTicketPauseDto } from 'src/dto/trouble-ticket-pause/update-trouble-ticket-pause.dto';
import { TroubleTicketPauseDto } from 'src/dto/trouble-ticket/trouble-ticket-pause.dto';
import { APP_CONSTANTS, APP_MESSAGES } from 'src/common/enums/enums';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';

@Controller('pause-ticket')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class TroubleTicketPauseController {
  constructor(
    private readonly troubleTicketPauseService: TroubleTicketPauseService,
  ) {}

  @Post()
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_PAUSE.CREATED)
  async pauseRequest(@Body() body: TroubleTicketPauseDto) {
    return this.troubleTicketPauseService.createPauseTicketRequest(body);
  }

  @Patch('/:id/pause/approve')
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_PAUSE.APPROVED)
  async approvePauseTicketRequest(
    @Param('id') id: number,
    @Body() body: UpdateTroubleTicketPauseDto,
  ) {
    return this.troubleTicketPauseService.approvePauseTicket(id, body);
  }

  @Patch('/:id/pause/resume')
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_PAUSE.RESUMED)
  async resumePauseTicket(
    @Param('id') id: number,
    @Body() body: UpdateTroubleTicketPauseDto,
  ) {
    return this.troubleTicketPauseService.resumePauseRequest(
      id,
      body,
      APP_CONSTANTS.TYPE.MANUAL,
    );
  }

  @Patch('/:id/pause/cancel-pause-request')
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_PAUSE.REJECTED)
  async cancelPauseRequest(
    @Param('id') id: number,
    @Body() body: UpdateTroubleTicketPauseDto,
  ) {
    const { ticketId, updated_by, comment, attachment } = body;
    const cancelPauseTicker =
      await this.troubleTicketPauseService.cancelPauseRequest(
        id,
        ticketId,
        updated_by,
        comment,
        attachment,
      );
    await this.troubleTicketPauseService.cancelPauseTicket(id);
    return cancelPauseTicker;
  }

  @Delete('/:id')
  @ResponseMessageMetadata(APP_MESSAGES.TROUBLE_TICKET_PAUSE.DELETED)
  async deletePause(@Param('id') id: number) {
    return this.troubleTicketPauseService.cancelPauseTicket(id);
  }
}
