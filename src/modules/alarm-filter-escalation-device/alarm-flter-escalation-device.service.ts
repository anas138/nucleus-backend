import { Injectable } from '@nestjs/common';
import { AlarmFilterEscalationFilterDeviceRepository } from './alarm-flter-escalation-device.repositroy';
import { BaseService } from 'src/common/services/base.service';
import { AlarmFilterEscalationDevice } from 'src/entities/alarm-filter-escalation-device.entity';
import { AppType } from 'src/common/enums/enums';
import { In, Not, QueryRunner } from 'typeorm';
import { TicketEscalationDevice } from 'src/models/alarm-filter.model';
import { FetchAlarmFilterConfigModel } from 'src/models/alarm-filter-config.model';

@Injectable()
export class AlarmFilterEscalationDeviceService extends BaseService<AlarmFilterEscalationDevice> {
  constructor(
    private readonly alarmFilterEscalationFilterDeviceRepository: AlarmFilterEscalationFilterDeviceRepository,
  ) {
    super(alarmFilterEscalationFilterDeviceRepository);
  }

  async createAndUpdate(
    ticket_escalation_device: number[] | string[],
    alarmFilterConfigData: FetchAlarmFilterConfigModel,
    queryRunner: QueryRunner,
  ) {
    const deviceId = {
      [AppType.NCE]: 'nce_device_id',
      [AppType.OBSERVIUM]: 'obs_device_id',
      [AppType.NOKIA_TXN]: 'nokia_device_id',
      [AppType.NCE_GPON]: 'nce_gpon_device_id',
      [AppType.LDI_SOFTSWITCH_EMS]: 'ldi_softswitch_trunk_group_id',
    };

    const devices = await this.findAll({
      where: {
        [deviceId[alarmFilterConfigData.app_type]]: Not(
          In([...ticket_escalation_device]),
        ),
        alarm_filter_config_id: alarmFilterConfigData.id,
      },
    });

    await this.deleteRecord(
      {
        id: In(devices.filter((d) => d.id).map((d) => d.id)),
      },
      queryRunner.manager,
    );

    for (let id of ticket_escalation_device) {
      const payload = {
        alarm_filter_config_id: alarmFilterConfigData.id,
        app_type: alarmFilterConfigData.app_type,
        [deviceId[alarmFilterConfigData.app_type]]: id,
      };
      const exists = await this.findById({
        [deviceId[alarmFilterConfigData.app_type]]: id,
        alarm_filter_config_id: alarmFilterConfigData.id,
      });
      if (exists) {
        await this.updateWithTransactionScope(
          { id: exists.id },
          { ...payload },
          queryRunner.manager,
        );
      } else {
        await this.create(payload, queryRunner.manager);
      }
    }
    return;
  }

  async getDevicesByAlarmFilterConfig(id: number) {
    return this.findAll({ where: { alarm_filter_config_id: id } });
  }
}
