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
import { NceGponAlarmsService } from './nce-gpon-alarms.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { NCEAlarmModel } from 'src/models/nce-alarm.model';
import { NceALarmSearchFilterDto } from 'src/dto/alarm-search-filter/nce-alarm-search-filter.dto';
import { SendMailModel } from 'src/models/send-mail.model';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';

@Controller('nce-gpon-alarms')
@UseGuards(AuthGuard())
export class NceGponAlarmsController {
  constructor(private nceGponAlarmsService: NceGponAlarmsService) {}

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.NCE_ALARMS.ALARMS_FETCHED)
  async getAllNceGponAlarms(
    @Query() nceGponAlarmSearchFilterDto: any,
  ): Promise<any> {
    return this.nceGponAlarmsService.findAllPaginated(
      nceGponAlarmSearchFilterDto,
    );
  }

  @Post()
  async createAlarm(@Body() data: any) {
    return this.nceGponAlarmsService.create(data);
  }

  @Get('recipients')
  async getRecipients(@Query() query: any) {
    return this.nceGponAlarmsService.getReleventRecipeientsOfTheAlarm(query);
  }

  @Get(':id')
  @ResponseMessageMetadata(APP_MESSAGES.NCE_ALARMS.ALARM_FETCHED)
  async getNceGponAlarmById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.nceGponAlarmsService.findByCondition({ id }, null, [
      'nceGponNetworkElement',
      'nceGponNetworkElement.region',
      'alarm_filter_config',
    ]);
  }

  @Get('template/:alarmId')
  async getMailTemplate(
    @Param('alarmId', ParseIntPipe) alarmId: number,
  ): Promise<any> {
    const renderedHtml = await this.nceGponAlarmsService.getAlarmEmailTemplate(
      alarmId,
    );
    return renderedHtml;
  }

  @Post('send-email/:alarmId')
  @ResponseMessageMetadata(APP_MESSAGES.MAILER.MAIL_SENT)
  async sendNceAlarmMail(
    @Param('alarmId', ParseIntPipe) alarmId: number,
    @Body() sendMailModel: SendMailModel,
  ) {
    await this.nceGponAlarmsService.sendNceGponAlarmMail(
      sendMailModel,
      alarmId,
    );
  }
}
