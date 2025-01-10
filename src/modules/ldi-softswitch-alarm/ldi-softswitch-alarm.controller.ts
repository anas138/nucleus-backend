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
import { LdiSoftSwitchAlarmService } from './ldi-softswitch-alarm.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { LdiSoftswitchAlarmsFilterModel } from 'src/models/ldi-softswitch-alarm-queue-message.model';
import { PaginatedResultsModel } from 'src/models/pagination.model';
import { SendMailModel } from 'src/models/send-mail.model';
import { AlarmRelevantUserQueryParams_DTO } from 'src/dto/alarm-filter-config/alarm-relevant-user-query.dto';

@Controller('ldi-softswitch-alarms')
@UseGuards(AuthGuard())
export class LdiSoftSwitchAlarmController {
  constructor(
    private readonly ldiSoftSwitchAlarmService: LdiSoftSwitchAlarmService,
  ) {}

  @Get()
  @ResponseMessageMetadata(APP_MESSAGES.NCE_ALARMS.ALARMS_FETCHED)
  async getAllLdiAlarms(
    @Query() ldiAlarmSearchFilterDto: LdiSoftswitchAlarmsFilterModel,
  ): Promise<PaginatedResultsModel> {
    return this.ldiSoftSwitchAlarmService.findAllPaginated(
      ldiAlarmSearchFilterDto,
    );
  }

  @Get('recipients')
  async getRecipients(@Query() query: AlarmRelevantUserQueryParams_DTO) {
    return this.ldiSoftSwitchAlarmService.getReleventRecipeientsOfTheAlarm(
      query,
    );
  }

  @Get('/:id')
  async getAlarmsById(@Param('id') id: number) {
    return this.ldiSoftSwitchAlarmService.findByCondition({ id: id }, null, [
      'ldiSoftswitchTrunkGroup',
      'alarm_filter_config',
      'alarmType',
    ]);
  }

  @Get('template/:alarmId')
  async getMailTemplate(
    @Param('alarmId', ParseIntPipe) alarmId: number,
  ): Promise<any> {
    const renderedHtml =
      await this.ldiSoftSwitchAlarmService.getAlarmEmailTemplate(alarmId);
    return renderedHtml;
  }

  @Post('send-email/:alarmId')
  @ResponseMessageMetadata(APP_MESSAGES.MAILER.MAIL_SENT)
  async sendNceAlarmMail(
    @Param('alarmId', ParseIntPipe) alarmId: number,
    @Body() sendMailModel: SendMailModel,
  ) {
    await this.ldiSoftSwitchAlarmService.sendLdiSoftswitchAlarmMail(
      sendMailModel,
      alarmId,
    );
  }
}
