import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmFilterConfigRepository extends BaseAbstractRepository<AlarmFilterConfig> {
  constructor(
    @InjectRepository(AlarmFilterConfig) repo: Repository<AlarmFilterConfig>,
  ) {
    super(repo);
  }
}
