import { Body, Controller, Post } from '@nestjs/common';
import { ObserviumService } from './observium.service';

@Controller()
export class ObserviumController {
  constructor(private service: ObserviumService) {}

  @Post('/api/observium-alerts')
  async alertWebhook(@Body() payload: any): Promise<any> {
    await this.service.handleAlertPost(payload);
    return payload;
  }
}
