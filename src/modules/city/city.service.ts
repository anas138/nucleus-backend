import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { City } from 'src/entities/city.entity';
import { CityRepository } from './city.repository';
import { FetchCityModel } from 'src/models/fetch-city.model';
import { FindOptionsWhere, Like } from 'typeorm';

@Injectable()
export class CityService extends BaseService<City> {
  constructor(private repo: CityRepository) {
    super(repo);
  }

  async findCities(fetchCityModel: FetchCityModel): Promise<any> {
    const { country_id, province_id, region_id, search } = fetchCityModel;
    const where: FindOptionsWhere<City> = {};

    if (country_id) {
      where.country_id = country_id;
    }
    if (province_id) {
      where.province_id = province_id;
    }
    if (region_id) {
      where.region_id = region_id;
    }
    if (search) {
      where.name = Like(`%${search}%`);
    }
    const result = this.repo.findAll({
      where
    });
    return result;
  }
}
