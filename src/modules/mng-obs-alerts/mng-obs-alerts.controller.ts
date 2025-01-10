import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { MngObsAlertsService } from './mng-obs-alerts.service';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { CreateMngObsAlertsDto } from 'src/dto/mng-obs-alerts/create-mng-obs-alerts.dto';
import { CreateMngObsAlertsModel } from 'src/models/mng-obs-alerts.model';

@UseInterceptors(new OnCreateInterceptor())
@Controller('listener/obs-alerts')
export class MngObsAlertsController {
  constructor(private readonly mngObsAlertsService: MngObsAlertsService) {}

  @Post()
  async postObservium(
    @Body() data: CreateMngObsAlertsDto,
  ): Promise<CreateMngObsAlertsModel> {
    return this.mngObsAlertsService.createData(data);
  }
}
