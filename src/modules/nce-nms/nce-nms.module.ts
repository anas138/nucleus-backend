import { Module } from '@nestjs/common';
import { NceNmsService } from './nce-nms.service';
import { NceNmsController } from './nce-nms.controller';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { NceNmsApiService } from './nce-nms-api.service';
import { NceNetworkElementModule } from '../nce-network-element/nce-network-element.module';
import { NceNmsCacheService } from './nce-nms.cache.service';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';
import { NceLtpModule } from '../nce-ltp/nce-ltp.module';
import { NceSubnetModule } from '../nce-subnet/nce-subnet.module';

@Module({
  imports: [
    // NceNetworkElementModule, NceLtpModule, NceSubnetModule
  ],
  providers: [
    NceNmsService,
    EnvironmentConfigService,
    NceNmsApiService,
    NceNmsCacheService,
    CacheManagerService,
  ],
  controllers: [NceNmsController],
  exports: [NceNmsApiService, NceNmsService, NceNmsCacheService],
})
export class NceNmsModule {}
