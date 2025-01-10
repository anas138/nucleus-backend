import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Country } from 'src/entities/country.entity';
import { CountryRepository } from './country.repository';

@Injectable()
export class CountryService extends BaseService<Country> {
  constructor(private repo: CountryRepository) {
    super(repo);

  }
  
}
