import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { APP_CONSTANTS, seconds } from '../enums/enums';

@Injectable()
export class RedisCacheService {

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) { }

  async get(key: string): Promise<any> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, data: any, ttl?: seconds): Promise<void> {
    const value = JSON.stringify(data);
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  /**
   * 
   * @param key 
   * @param value 
   * @param ttl
   * @returns | any or 'success_set'
   */
  async getOrSet(key: string, value: string, ttl: seconds = APP_CONSTANTS.CACHE_MANAGER.TTL.DEFAULT): Promise<any> {
    const find = await this.get(key);
    if (!find) {
      await this.set(key, value, ttl);
      return 'success_set';
    }
    return find;
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }
}
