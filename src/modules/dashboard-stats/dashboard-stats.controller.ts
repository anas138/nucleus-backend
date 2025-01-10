import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardStatsService } from './dashboard-stats.service';
import { IpTrendsDTO, TransmissionTrendsDTO } from 'src/dto/trends/trends.dto';
import { AlarmFilterPeriod, AlarmStatus } from 'src/common/enums/enums';

@Controller('dashboard-stats')
@UseGuards(AuthGuard())
export class DashboardStatsController {
  constructor(private readonly service: DashboardStatsService) {}
  @Get('trends/transmission')
  async getNceAlarmsTrends(
    @Query() transmissionTrendsDto: TransmissionTrendsDTO,
  ): Promise<any> {
    return this.service.getNceAlarmsTrends(transmissionTrendsDto);
  }

  @Get('trends/ip')
  async getObsAlertsTrends(@Query() ipTrendsDTO: IpTrendsDTO): Promise<any> {
    return this.service.getObsAlertsTrends(ipTrendsDTO);
  }

  @Get('trends/gpon')
  async getNceGponAlarmsTrends(
    @Query() transmissionTrendsDto: TransmissionTrendsDTO,
  ): Promise<any> {
    return this.service.getNceGponAlarmsTrends(transmissionTrendsDto);
  }

  @Get('trends/nokia-txn')
  async getNokiaTxnAlarmsTrends(
    @Query() transmissionTrendsDto: TransmissionTrendsDTO,
  ): Promise<any> {
    return this.service.getNokiaTxnAlarmsTrends(transmissionTrendsDto);
  }

  @Get('trends/ldi-softswitch')
  async getLdiSoftswitchAlarmsTrends(
    @Query() transmissionTrendsDto: TransmissionTrendsDTO,
  ): Promise<any> {
    return this.service.getLdiSoftswitchAlarmsTrends(transmissionTrendsDto);
  }

  @Get('counts/transmission')
  async getNceAlarmCount(
    @Query('status') status?: AlarmStatus,
    @Query('period')
    period?: AlarmFilterPeriod,
  ): Promise<any> {
    return this.service.getNceAlarmCount(status, period);
  }

  @Get('counts/ip')
  async getObsAlertsCount(
    @Query('status') status?: AlarmStatus,
    @Query('period')
    period?: AlarmFilterPeriod,
  ): Promise<any> {
    return this.service.getObsAlertsCount(status, period);
  }

  @Get('counts/gpon')
  async getNceGponAlarmCount(
    @Query('status') status?: AlarmStatus,
    @Query('period')
    period?: AlarmFilterPeriod,
  ): Promise<any> {
    return this.service.getNceGponAlarmCount(status, period);
  }

  @Get('counts/nokia-txn')
  async getNokiaTxnAlarmCount(
    @Query('status') status?: AlarmStatus,
    @Query('period')
    period?: AlarmFilterPeriod,
  ): Promise<any> {
    return this.service.getNokiaTxnAlarmCount(status, period);
  }

  @Get('counts/ldi-softswitch')
  async getLdiSoftswitchAlarmCount(
    @Query('status') status?: AlarmStatus,
    @Query('period')
    period?: AlarmFilterPeriod,
  ): Promise<any> {
    return this.service.getLdiSoftswitchAlarmCount(status, period);
  }
}
