import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AlarmFilterConfigService } from './alarm-filter-config.service';
import {
  CreateAlarmFilterDto,
  transformCreateAlarmFilterDto,
} from 'src/dto/alarm-filter-config/create-alarm-filter.dto';
import { APP_MESSAGES, AppType } from 'src/common/enums/enums';
import { AuthGuard } from '@nestjs/passport';
import {
  UpdateAlarmFilterDto,
  transformUpdateAlarmFilterDto,
} from 'src/dto/alarm-filter-config/update-alarm-filter.dto';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { GetSingleByParamsDto } from 'src/dto/alarm-filter-config/get-single-by-params.dto';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { AlarmFilterConfigQueryParam } from 'src/models/alarm-filter.model';
@Controller('alarm-filter-config')
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
@UseGuards(AuthGuard())
export class AlarmFilterConfigController {
  constructor(private readonly service: AlarmFilterConfigService) {}

  private readonly entityJoins = [
    'alarm_filter_advanced_conditions',
    'alarm_recipients',
  ];
  @Post('sync')
  async SyncALarmConfig() {
    return this.service.extractAlarmFilterConfigurationFromCsv();
  }

  @Post()
  @ResponseMessageMetadata(APP_MESSAGES.ALARM_FILTER_CONFIG.CREATED)
  async createAlarmFilter(@Body() createAlarmFilterDto: CreateAlarmFilterDto) {
    let transformedCreateAlarmFilterDto =
      transformCreateAlarmFilterDto(createAlarmFilterDto);
    return this.service.createAlarmFilter(transformedCreateAlarmFilterDto);
  }

  @Get('app-type/:appType')
  async getAllAlarmFilters(
    @Param('appType', new ParseEnumPipe(AppType)) appType: AppType,
    @Query() queryParam: AlarmFilterConfigQueryParam,
  ) {
    return this.service.getAllAlarmsFilterConfig(queryParam, appType);
  }

  @Get(':appType/alarm-name')
  async getALarmNamesByAppType(
    @Param('appType', new ParseEnumPipe(AppType)) appType: AppType,
  ) {
    return this.service.getALarmNamesByAppType(appType);
  }

  @Put(':id')
  @ResponseMessageMetadata(APP_MESSAGES.ALARM_FILTER_CONFIG.UPDATED)
  async updateAlarmFilter(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlarmFilterDto: UpdateAlarmFilterDto,
  ) {
    let transformedUpdateAlarmFilterDto =
      transformUpdateAlarmFilterDto(updateAlarmFilterDto);
    return this.service.updateAlarmFilter(id, transformedUpdateAlarmFilterDto);
  }

  @Get(':id')
  async getAlarmFilterById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAlarmFilterById(id);
  }

  @Get('app-type/:appType/single')
  async getSingleAlarmFilterByParams(
    @Param('appType', new ParseEnumPipe(AppType)) appType: AppType,
    @Query() query: GetSingleByParamsDto,
  ) {
    return this.service.findByCondition(
      {
        app_type: appType,
        alarm_name: query.alarm_name,
        severity: query.severity,
      },
      null,
      [...this.entityJoins],
    );
  }

  @Get()
  async getAllAlarmConfig() {
    return this.service.getAllAlarms();
  }
}
