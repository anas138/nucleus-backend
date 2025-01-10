import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities/country.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class CountryRepository extends BaseAbstractRepository<Country> {
  constructor(
    @InjectRepository(Country)
    private readonly countryEntity: Repository<Country>,
  ) {
    super(countryEntity);
  }
}
