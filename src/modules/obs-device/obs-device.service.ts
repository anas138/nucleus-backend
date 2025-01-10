import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { ObserviumDevice } from 'src/entities/obs-device.entity';
import { ObsDeviceRepository } from './obs-device.repository';
import {
  IObsDevice,
  transformObserviumDeviceResponse,
} from 'src/models/obs-device.model';
import { DataSource, EntityManager, FindOptionsWhere } from 'typeorm';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { CityService } from '../city/city.service';
import { City } from 'src/entities/city.entity';
import { ListenerApiService } from '../listener-api/listener-api.service';
import { PortBitsGraphDto } from 'src/dto/obs-nms/port-bits-graph.dto';

@Injectable()
export class ObsDeviceService extends BaseService<ObserviumDevice> {
  constructor(
    private repo: ObsDeviceRepository,
    private cityService: CityService,
    private helperFunctions: HelperFunctions,
    private listenerApiService: ListenerApiService,
    private dataSource: DataSource,
  ) {
    super(repo);
  }

  create(data: IObsDevice, entityManager?: EntityManager) {
    return this.repo.create(data, entityManager);
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryModel,
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(paginationQuery);
    return this.repo.findAllPaginated(calculatedPagination);
  }

  async populateRegionAndCityFromCsv() {
    const devices = await this.readObserviumDevicesCsv();
    for (let device of devices) {
      let where: FindOptionsWhere<City> = { name: device.City };
      if (device.Location.trim() !== 'International') {
        where = { ...where, country_id: 1 };
      }
      const city = await this.cityService.findByCondition(where);
      const observiumDevice = await this.repo.findByCondition({
        hostname: device.Hostname,
      });
      if (city && observiumDevice) {
        observiumDevice.location_city = city.name;
        observiumDevice.city = city;
        observiumDevice.city_id = city.id;
        observiumDevice.region = city.region;
        observiumDevice.region_id = city.region_id;
        await this.repo.update(observiumDevice);
      } else {
        console.log(device.City, device.Hostname);
      }
    }
  }

  async readObserviumDevicesCsv() {
    const filePath = `${process.cwd()}/TWA-IPNOC-Devices.csv`;
    const devices = await this.helperFunctions.parseCsv(filePath);
    return devices;
  }

  async syncObsDevices() {
    const resp = await this.listenerApiService.get('obs-nms/devices');
    const data = Object.values(resp['data']['devices']);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await Promise.all(
        data.map(async (item) => {
          const obsDevices: IObsDevice = transformObserviumDeviceResponse(item);
          await this.create(obsDevices, queryRunner.manager);
        }),
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getPortBitsGraph(portId: any, query: PortBitsGraphDto) {
    const queryObj = {};
    Object.assign(queryObj, query);
    const url = `/obs-nms/graphs/port-bits/${portId}?${new URLSearchParams(
      queryObj,
    ).toString()}`;
    const bufferData = await this.listenerApiService.get(url, 'arraybuffer');
    return Buffer.from(bufferData);
  }
}
