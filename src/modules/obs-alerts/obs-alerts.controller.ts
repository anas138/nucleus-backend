import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ObsAlertsService } from './obs-alerts.service';
import { IObsAlert } from 'src/models/obs-alert.model';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PaginatedResultsModel } from 'src/models/pagination.model';
import { ObsALertSearchFilterDto } from 'src/dto/alarm-search-filter/obs-alert-search-filter.dto';
import { SendMailModel } from 'src/models/send-mail.model';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';

@Controller('obs-alerts')
@UseGuards(AuthGuard())
export class ObsAlertsController {
  constructor(private obsAlertsService: ObsAlertsService) {}

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.OBS_ALERTS.ALERTS_FETCHED)
  async getObsAlerts(
    @Query() obsALertSearchFilterDto: ObsALertSearchFilterDto,
  ): Promise<PaginatedResultsModel> {
    return this.obsAlertsService.findAllWithPagination(obsALertSearchFilterDto);
  }

  @Get('/recipients')
  async getRecipients(@Query() query: AlarmRelevantUserQueryParams_DTO) {
    return this.obsAlertsService.getReleventRecipeientsOfTheAlarm(query);
  }

  @Get(':id')
  @ResponseMessageMetadata(APP_MESSAGES.OBS_ALERTS.ALERT_FETCHED)
  async getObsAlertsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IObsAlert> {
    return this.obsAlertsService.findByCondition({ id }, null, [
      'device',
      'device.region',
      'device.city',
      'device.city.country',
      'troubleTicket',
      'alarm_filter_config',
    ]);
  }

  @Post('send-email/:alertId')
  @ResponseMessageMetadata(APP_MESSAGES.MAILER.MAIL_SENT)
  async sendObsAlertMail(
    @Param('alertId', ParseIntPipe) alertId: number,
    @Body() sendMailModel: SendMailModel,
  ) {
    await this.obsAlertsService.sendObserviumAlertMail(sendMailModel, alertId);
  }

  @Get('/template/:alarmId')
  async getMailTemplate(
    @Param('alarmId', ParseIntPipe) alarmId: number,
  ): Promise<any> {
    const renderedHtml = await this.obsAlertsService.getAlarmEmailTemplate(
      alarmId,
    );
    return renderedHtml;
  }
}
