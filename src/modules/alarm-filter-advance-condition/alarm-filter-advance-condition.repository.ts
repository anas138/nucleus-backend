import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmFilterAdvanceCondition } from 'src/entities/alarm-filter-advance-condition.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmFilterAdvanceConditionRepository extends BaseAbstractRepository<AlarmFilterAdvanceCondition> {
  constructor(
    @InjectRepository(AlarmFilterAdvanceCondition)
    private readonly repo: Repository<AlarmFilterAdvanceCondition>,
  ) {
    super(repo);
  }
}
