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
import { NokiaTxnAlarmsService } from './nokia-txn-alarms.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { SendMailModel } from 'src/models/send-mail.model';
import { NokiaTxnALarmSearchFilterDto } from 'src/dto/alarm-search-filter/nokia-alarm-search-filter.dto';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';

@Controller('nokia-txn-alarms')
@UseGuards(AuthGuard())
export class NokiaTxnAlarmsController {
  constructor(private service: NokiaTxnAlarmsService) {}

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.NCE_ALARMS.ALARMS_FETCHED)
  async getAllNokiaTxnAlarms(
    @Query() searchFilterDto: NokiaTxnALarmSearchFilterDto,
  ): Promise<any> {
    const data = await this.service.findAllPaginated(searchFilterDto);
    return data;
  }

  @Post()
  async createAlarm(@Body() data: any) {
    return this.service.create(data);
  }

  @Get('recipients')
  async getRecipients(@Query() query: AlarmRelevantUserQueryParams_DTO) {
    return this.service.getReleventRecipeientsOfTheAlarm(query);
  }

  @Get(':id')
  @ResponseMessageMetadata(APP_MESSAGES.NCE_ALARMS.ALARM_FETCHED)
  async getNokiaTxnAlarmById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.service.findByCondition({ id }, null, [
      'nokiaTxnNetworkElement',
      'alarm_filter_config',
    ]);
  }

  @Get('template/:alarmId')
  async getMailTemplate(
    @Param('alarmId', ParseIntPipe) alarmId: number,
  ): Promise<any> {
    const renderedHtml = await this.service.getAlarmEmailTemplate(alarmId);
    return renderedHtml;
  }

  @Post('send-email/:alarmId')
  @ResponseMessageMetadata(APP_MESSAGES.MAILER.MAIL_SENT)
  async sendNceAlarmMail(
    @Param('alarmId', ParseIntPipe) alarmId: number,
    @Body() sendMailModel: SendMailModel,
  ) {
    await this.service.sendNokiaTxnAlarmMail(sendMailModel, alarmId);
  }
}
