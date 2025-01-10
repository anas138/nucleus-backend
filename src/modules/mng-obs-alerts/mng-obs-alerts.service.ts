import { Injectable } from '@nestjs/common';
import { MngObsAlertsRepository } from './mng-obs-alerts.repository';
import { CreateMngObsAlertsModel } from 'src/models/mng-obs-alerts.model';

@Injectable()
export class MngObsAlertsService {
  constructor(
    private readonly mngObsAlertsRepository: MngObsAlertsRepository,
  ) {}

  async createData(
    data: CreateMngObsAlertsModel,
  ): Promise<CreateMngObsAlertsModel> {
    return this.mngObsAlertsRepository.createData(data);
  }
}
