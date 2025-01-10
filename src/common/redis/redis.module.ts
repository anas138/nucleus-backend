import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { EnvironmentConfigService } from "src/config/environment-config/environment-config.service";

const envConfigService = new EnvironmentConfigService(new ConfigService())

/**
 *  Create global RedisModule available throughout the application without needing to import it every module
 *  And useFactory initializes Redis client with config and provides it as REDIS_CLIENT that can b injected elsewhere
 */


@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: envConfigService.getRedisHost()
        })
      }
    }
  ],
  exports: ['REDIS_CLIENT']
})
export class RedisModule { }