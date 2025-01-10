import { Injectable } from '@nestjs/common';
import { NceNmsApiService } from './nce-nms-api.service';
import {
  INceNetworkElementModel,
  transformNetworkElementResponse,
} from 'src/models/nce-network-element.model';
import { INceLtpModel, transformLtpResponse } from 'src/models/nce-ltp.model';
import { NceNetworkElementService } from '../nce-network-element/nce-network-element.service';
import { DataSource } from 'typeorm';
import { NceLtpService } from '../nce-ltp/nce-ltp.service';
import {
  INceSubnetModel,
  transformNceSubnetResponse,
} from 'src/models/nce-subnet.model';
import { NceSubnetService } from '../nce-subnet/nce-subnet.service';

/**
 * Service Dedicated For NCE NMS REST APIs Integerations
 */

@Injectable()
export class NceNmsService {
  constructor(
    // private dataSource: DataSource,
    private readonly nceApiService: NceNmsApiService,
  ) // private readonly networkElementService: NceNetworkElementService,
  // private readonly ltpService: NceLtpService,
  // private readonly subnetService: NceSubnetService,
  {}

  async getNEDetailsById(
    neResourceId: string,
  ): Promise<INceNetworkElementModel> {
    console.log('NCE-CALLED-NE');
    const resp = await this.nceApiService.get(
      `/restconf/v2/data/huawei-nce-resource-inventory:network-elements/network-element/${neResourceId}`,
    );
    const data = resp
      ? transformNetworkElementResponse(resp['network-element'][0])
      : null;
    return data;
  }

  async getNetworkElements(): Promise<any> {
    const resp = await this.nceApiService.get(
      '/restconf/v2/data/huawei-nce-resource-inventory:network-elements',
    );
    return resp;
  }

  async getLtpDetailsById(ltpResourceId: string): Promise<INceLtpModel> {
    console.log('NCE-CALLED-LTP');
    const resp = await this.nceApiService.get(
      `/restconf/v2/data/huawei-nce-resource-inventory:ltps/ltp/${ltpResourceId}`,
    );
    const data = resp ? transformLtpResponse(resp['ltp'][0]) : null;
    return data;
  }

  async getLtps(): Promise<any> {
    const resp = await this.nceApiService.get(
      '/restconf/v2/data/huawei-nce-resource-inventory:ltps',
    );
    return resp;
  }

  /**
   * Fetch all network-elements and store in database
   */
  async syncNetworkElements(): Promise<any> {
    // const resp = await this.getNetworkElements();
    // const data: Array<any> = resp['network-elements']['network-element'];
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.startTransaction();
    // try {
    //   await Promise.all(
    //     data.map(async (item) => {
    //       const networkElement: INceNetworkElementModel =
    //         transformNetworkElementResponse(item);
    //       await this.networkElementService.create(
    //         networkElement,
    //         queryRunner.manager,
    //       );
    //     }),
    //   );
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
  }

  async syncLtps(): Promise<any> {
    // const resp = await this.getLtps();
    // const data: Array<any> = resp['ltps']['ltp'];
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.startTransaction();
    // try {
    //   await Promise.all(
    //     data.map(async (item) => {
    //       const ltp: INceLtpModel = transformLtpResponse(item);
    //       await this.ltpService.create(ltp, queryRunner.manager);
    //     }),
    //   );
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
  }

  async getSubnets(): Promise<any> {
    const resp = await this.nceApiService.get(
      '/restconf/v2/data/huawei-nce-resource-inventory:subnets',
    );
    return resp;
  }

  async syncSubnets(): Promise<any> {
    //   const resp = await this.getSubnets();
    //   const data: Array<any> = resp['subnets']['subnet'];
    //   const queryRunner = this.dataSource.createQueryRunner();
    //   await queryRunner.startTransaction();
    //   try {
    //     await Promise.all(
    //       data.map(async (item) => {
    //         const subnet: INceSubnetModel = transformNceSubnetResponse(item);
    //         await this.subnetService.upsert(subnet, queryRunner.manager);
    //       }),
    //     );
    //     await queryRunner.commitTransaction();
    //   } catch (err) {
    //     console.log(err);
    //     await queryRunner.rollbackTransaction();
    //   } finally {
    //     await queryRunner.release();
    //   }
  }
}
