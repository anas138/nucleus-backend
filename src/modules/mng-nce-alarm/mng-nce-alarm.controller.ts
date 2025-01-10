import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { MngNceAlarmService } from './mng-nce-alarm.service';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { CreateMngNceAlarmModel } from 'src/models/mng-nce-alarm.model';
import { CreateMngNceAlarmDto } from 'src/dto/mng-nce-alarm/create-mng-nce-alarm.dto';

@UseInterceptors(new OnCreateInterceptor())
@Controller('listener/nce-alerts')
export class MngNceAlarmController {
  constructor(private readonly mngNceAlarmService: MngNceAlarmService) {}

  @Post()
  async NceAlerts(
    @Body() data: CreateMngNceAlarmDto,
  ): Promise<CreateMngNceAlarmModel> {
    return this.mngNceAlarmService.createData(data);
  }
}
