import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { NceNetworkElement } from 'src/entities/nce-network-element.entity';
import { NceNetworkElementRepository } from './nce-network-element.repository';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import {
  INceNetworkElementModel,
  transformNetworkElementResponse,
} from 'src/models/nce-network-element.model';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { RegionService } from '../region/region.service';
import { Region } from 'src/entities/region.entity';
import { ListenerApiService } from '../listener-api/listener-api.service';
import { NceSubnetService } from '../nce-subnet/nce-subnet.service';
import {
  INceSubnetModel,
  transformNceSubnetResponse,
} from 'src/models/nce-subnet.model';

@Injectable()
export class NceNetworkElementService extends BaseService<NceNetworkElement> {
  constructor(
    private readonly repo: NceNetworkElementRepository,
    private helperFunctions: HelperFunctions,
    private regionService: RegionService,
    private readonly listenerApiService: ListenerApiService,
    private dataSource: DataSource, // private readonly subnetService: NceSubnetService,
    private readonly subnetService: NceSubnetService,
  ) {
    super(repo);
  }

  create(data: INceNetworkElementModel, entityManager?: EntityManager) {
    return this.repo.create(data, entityManager);
  }
  async findAllPaginated(
    paginationQuery: PaginationQueryModel,
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(paginationQuery);
    return this.repo.findAllPaginated(calculatedPagination);
  }

  async populateRegionFromCsv() {
    const neList = await this.readNceNetworklementCsv();
    for (let ne of neList) {
      const whereNe: FindOptionsWhere<NceNetworkElement> = {
        ip_address: ne['NE IP Address'],
      };
      const whereRegion: FindOptionsWhere<Region> = {
        name: ne['Region'],
      };
      const networkElement = await this.repo.findByCondition(whereNe);
      const region = await this.regionService.findByCondition(whereRegion);
      if (networkElement && region) {
        networkElement.region = region;
        networkElement.region_id = region.id;
        await this.repo.update(networkElement);
      } else {
        console.log(networkElement, region);
      }
    }
    return;
  }

  async populateNeReferenceId() {
    const filePath = `${process.cwd()}/docs/NCE/NE List.xlsx`;

    const neList = await this.helperFunctions.readXLSX(filePath);
    for (let ne of neList) {
      const whereNe: FindOptionsWhere<NceNetworkElement> = {
        ip_address: ne['NE IP Address'],
      };
      const networkElement = await this.repo.findByCondition(whereNe);
      if (networkElement) {
        networkElement.ne_reference_id = ne['NE ID'];
        await this.repo.update(networkElement);
      } else {
        console.log(networkElement);
      }
    }
    return;
  }

  async readNceNetworklementCsv() {
    const filePath = `${process.cwd()}/NE_list.csv`;
    const devices = await this.helperFunctions.parseCsv(filePath);
    return devices;
  }

  public getNEByName(neName: string): Promise<NceNetworkElement> {
    return this.repo.findByCondition({ name: neName });
  }

  async syncNetworkElements(): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await this.syncSubnets(queryRunner);
    const resp = await this.listenerApiService.get('nce-nms/network-elements');
    const data: Array<any> =
      resp['data']['network-elements']['network-element'];

    try {
      await Promise.all(
        data.map(async (item) => {
          const networkElement: INceNetworkElementModel =
            transformNetworkElementResponse(item);
          await this.create(networkElement, queryRunner.manager);
        }),
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return data;
  }

  async syncSubnets(queryRunner: QueryRunner): Promise<any> {
    const resp = await this.listenerApiService.get('nce-nms/subnet');
    const data: Array<any> = resp['data']['subnets']['subnet'];
    try {
      await Promise.all(
        data.map(async (item) => {
          const subnet: INceSubnetModel = transformNceSubnetResponse(item);
          await this.subnetService.upsert(subnet, queryRunner.manager);
        }),
      );
    } catch (error) {}
  }
}