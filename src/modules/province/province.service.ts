import { Injectable } from '@nestjs/common';
import { ProvinceRepository } from './province.repository';
import { BaseService } from 'src/common/services/base.service';
import { Province } from 'src/entities/province.entity';


@Injectable()
export class ProvinceService extends BaseService<Province> {
  constructor(private repo: ProvinceRepository) {
    super(repo);

  }
  
}
