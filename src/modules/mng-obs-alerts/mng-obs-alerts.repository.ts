import { Inject, Injectable } from '@nestjs/common';
import { ObsAlerts } from 'src/mongoose-schemas/observium-alerts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMngObsAlertsModel } from 'src/models/mng-obs-alerts.model';

@Injectable()
export class MngObsAlertsRepository {
  constructor(@Inject('OBS_MODEL') private obsModel: Model<ObsAlerts>) {}

  async createData(
    data: CreateMngObsAlertsModel,
  ): Promise<CreateMngObsAlertsModel> {
    try {
      const obsData = new this.obsModel(data);
      return obsData.save();
    } catch (error) {}
  }
}
