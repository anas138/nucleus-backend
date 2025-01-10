import { Body, Controller, Post } from '@nestjs/common';
import { ObserviumTransformedAlertsQueueService } from './observium-transformed-alerts-queue.service';
import { transformObserviumAlertResponse } from 'src/models/obs-alert.model';

@Controller('obs-transformed')
export class ObserviumTransformedController {
  constructor(
    private readonly observiumTransformedAlertsQueueService: ObserviumTransformedAlertsQueueService,
  ) {}

  @Post()
  async createObsTransformed(@Body() body: any) {
    const transformedMessage = transformObserviumAlertResponse(body);
    return this.observiumTransformedAlertsQueueService.addJobInQueue(
      transformedMessage,
    );
  }
}
