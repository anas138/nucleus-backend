import { Inject, Injectable } from '@nestjs/common';
import { NceAlerts } from 'src/mongoose-schemas/nce-alerts.schema';
import { Model } from 'mongoose';
import { CreateMngNceAlarmModel } from 'src/models/mng-nce-alarm.model';

@Injectable()
export class MngNceAlarmsRepository {
  constructor(@Inject('NCE_MODEL') private nceModel: Model<NceAlerts>) {}

  async createData(
    data: CreateMngNceAlarmModel,
  ): Promise<CreateMngNceAlarmModel> {
    try {
      const nceData = new this.nceModel(data);
      return nceData.save();
    } catch (error) {}
  }
}
