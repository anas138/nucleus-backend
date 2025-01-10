import { Module } from '@nestjs/common';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { APP_CONSTANTS } from '../enums/enums';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';

const envConfigService = new EnvironmentConfigService(new ConfigService());
@Module({
  imports: [
    CacheModule.register<CacheModuleOptions>({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      // store: redisStore({
      //   url: `redis://${envConfigService.getRedisHost()}:${envConfigService.getRedisPort()}`,
      // }),
      store: redisStore,
      isGlobal: true,
      ttl: APP_CONSTANTS.CACHE_MANAGER.TTL.DEFAULT,
    }),
  ],
})
export class CacheManagerModule {}
