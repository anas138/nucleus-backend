import { Module } from '@nestjs/common';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';
import { ListenerApiService } from './listener-api.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Module({
  providers: [
    CacheManagerService,
    ListenerApiService,
    EnvironmentConfigService,
  ],
  exports: [ListenerApiService],
})
export class ListenerApiModule {}
