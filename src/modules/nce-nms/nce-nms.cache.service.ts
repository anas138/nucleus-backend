import { Injectable } from '@nestjs/common';
import { CacheManagerService } from 'src/common/cache/cache-manager.service';
import { APP_CONSTANTS } from 'src/common/enums/enums';
import { INceNetworkElementModel } from 'src/models/nce-network-element.model';
import { NceNmsService } from './nce-nms.service';
import { INceLtpModel } from 'src/models/nce-ltp.model';

@Injectable()
export class NceNmsCacheService {
  constructor(
    private cacheService: CacheManagerService,
    private nceNmsService: NceNmsService,
  ) {}

  /**
   * @description Fetch from cache or set cache if data does not exist
   * @param neResId
   * @returns
   */
  async getNeDetails(neResId: string): Promise<INceNetworkElementModel> {
    const resp = await this.cacheService.get(
      APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_NE_DETAILS + neResId,
    );
    let data = JSON.parse(resp);
    if (!data) {
      data = await this.nceNmsService.getNEDetailsById(neResId);
      if (data) {
        this.cacheService.set(
          APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_NE_DETAILS + neResId,
          JSON.stringify(data),
        );
      }
    }
    return data;
  }

  /**
   * @description Fetch from cache or set cache if data does not exist
   * @param ltpResId
   * @returns
   */
  async getLtpDetails(ltpResId: string): Promise<INceLtpModel> {
    const resp = await this.cacheService.get(
      APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_LTP_DETAILS + ltpResId,
    );
    let data = JSON.parse(resp);
    if (!data) {
      data = await this.nceNmsService.getLtpDetailsById(ltpResId);
      if (data) {
        this.cacheService.set(
          APP_CONSTANTS.CACHE_MANAGER.KEYS.NCE_LTP_DETAILS + ltpResId,
          JSON.stringify(data),
        );
      }
    } else {
      console.log('got-cache');
    }
    return data;
  }
}
