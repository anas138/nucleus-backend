import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { AlarmFilterEscalationDevice } from 'src/entities/alarm-filter-escalation-device.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlarmFilterEscalationFilterDeviceRepository extends BaseAbstractRepository<AlarmFilterEscalationDevice> {
  constructor(
    @InjectRepository(AlarmFilterEscalationDevice)
    repo: Repository<AlarmFilterEscalationDevice>,
  ) {
    super(repo);
  }
}
