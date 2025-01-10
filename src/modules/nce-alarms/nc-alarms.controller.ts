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
import { NceAlarmsService } from './nce-alarms.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { NCEAlarmModel } from 'src/models/nce-alarm.model';
import { NceALarmSearchFilterDto } from 'src/dto/alarm-search-filter/nce-alarm-search-filter.dto';
import { SendMailModel } from 'src/models/send-mail.model';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';

@Controller('nce-alarms')
@UseGuards(AuthGuard())
export class NceAlarmsController {
  constructor(private nceAlarmsService: NceAlarmsService) {}

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.NCE_ALARMS.ALARMS_FETCHED)
  async getAllNceAlarms(
    @Query() nceAlarmSearchFilterDto: NceALarmSearchFilterDto,
  ): Promise<any> {
    return this.nceAlarmsService.findAllPaginated(nceAlarmSearchFilterDto);
  }

  @Get('/recipients')
  async getRecipients(@Query() query: AlarmRelevantUserQueryParams_DTO) {
    return this.nceAlarmsService.getReleventRecipeientsOfTheAlarm(query);
  }

  @Get(':id')
  @ResponseMessageMetadata(APP_MESSAGES.NCE_ALARMS.ALARM_FETCHED)
  async getNceAlarmById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NCEAlarmModel> {
    return this.nceAlarmsService.findByCondition({ id }, null, [
      'network_element',
      'network_element.parent_subnet',
      'troubleTicket',
      'alarm_filter_config',
    ]);
  }

  @Post('send-email/:alarmId')
  @ResponseMessageMetadata(APP_MESSAGES.MAILER.MAIL_SENT)
  async sendNceAlarmMail(
    @Param('alarmId', ParseIntPipe) alarmId: number,
    @Body() sendMailModel: SendMailModel,
  ) {
    await this.nceAlarmsService.sendNceAlarmMail(sendMailModel, alarmId);
  }

  @Get('/template/:alarmId')
  async getMailTemplate(
    @Param('alarmId', ParseIntPipe) alarmId: number,
  ): Promise<any> {
    const renderedHtml = await this.nceAlarmsService.getAlarmEmailTemplate(
      alarmId,
    );
    return renderedHtml;
  }
}
