import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmRecipient } from 'src/entities/alarm-recipient.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmRecipientRepository extends BaseAbstractRepository<AlarmRecipient> {
  constructor(
    @InjectRepository(AlarmRecipient) repo: Repository<AlarmRecipient>,
  ) {
    super(repo);
  }
}
