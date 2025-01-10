import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from 'src/entities/province.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceRepository extends BaseAbstractRepository<Province> {
  constructor(
    @InjectRepository(Province)
    private readonly provinceEntity: Repository<Province>,
  ) {
    super(provinceEntity);
  }
}
