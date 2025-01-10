import { Injectable } from '@nestjs/common';
import { MngNceAlarmsRepository } from './mng-nce-alarm.repository';
import { CreateMngNceAlarmModel } from 'src/models/mng-nce-alarm.model';

@Injectable()
export class MngNceAlarmService {
  constructor(private readonly mngNceAlarmRepository: MngNceAlarmsRepository) {}

  async createData(
    data: CreateMngNceAlarmModel,
  ): Promise<CreateMngNceAlarmModel> {
    return this.mngNceAlarmRepository.createData(data);
  }
}
