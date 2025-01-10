import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { APP_CONSTANTS, milliseconds, seconds } from '../enums/enums';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
  async set(key: string, data: any, ttl?: seconds): Promise<void> {
    if (ttl) {
      const ttlInMilliseconds: milliseconds = ttl * 1000;
      await this.cacheManager.set(key, data, ttlInMilliseconds);
    } else {
      await this.cacheManager.set(key, data);
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
    const find = await this.cacheManager.get(key)
    if (!find) {
      await this.set(key, value, ttl)
      return 'success_set'
    }
    return find
  }

  async getNceToken(): Promise<string> {
    return this.cacheManager.get<string>(
      APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_TOKEN,
    );
  }
  async updateNceToken(token: string, del: boolean): Promise<void> {
    if (del)
      await this.cacheManager.del(APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_TOKEN);
    await this.cacheManager.set(
      APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_TOKEN,
      token,
    );
  }
  async getNceNeDetails(neResId: string) {
    return this.cacheManager.get(
      APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_NE_DETAILS + neResId,
    );
  }
  async getNceLtpDetails(ltpResId: string) {
    return this.cacheManager.get(
      APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_NE_DETAILS + ltpResId,
    );
  }
  async delete(key: string) {
    await this.cacheManager.set(key, '');
  }
}
