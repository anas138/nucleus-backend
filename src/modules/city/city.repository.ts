import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/entities/city.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class CityRepository extends BaseAbstractRepository<City> {
  constructor(
    @InjectRepository(City)
    private readonly cityEntity: Repository<City>,
  ) {
    super(cityEntity);
  }
}
