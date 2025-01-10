import { Global, Module } from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';

import { GatewayServiceModule } from 'src/microservices/gateways/services/gateway.service.module';

@Global()
@Module({
  imports: [GatewayServiceModule],
  providers: [EmailTemplatesService],
  exports: [EmailTemplatesService, GatewayServiceModule],
})
export class SharedModule {}
