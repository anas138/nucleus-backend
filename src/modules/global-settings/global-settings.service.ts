import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { GlobalSettingsRepository } from './global-settings.repository';
import { GlobalSettings } from 'src/entities/global-settings.entity';
import { FindOptionsWhere } from 'typeorm';
import { CreateGlobalSettingsDto } from 'src/dto/global-settings/create-global-settings.dto';
import {
  GlobalSettingsModel,
  GlobalSettingsQueryModel,
} from 'src/models/global-setting-model';
import {
  GlobalSettingsValuesDatatype,
  RecordStatus,
} from 'src/common/enums/enums';

@Injectable()
export class GlobalSettingsService extends BaseService<GlobalSettings> {
  constructor(
    private readonly globalSettingsRepository: GlobalSettingsRepository,
  ) {
    super(globalSettingsRepository);
  }

  async findSingleSetting(query: any, global_setting_type_id: number) {
    const where: FindOptionsWhere<GlobalSettings> = {
      ...query,
      global_setting_type_id: global_setting_type_id,
    };

    const data = await this.globalSettingsRepository.findAllByCondition(where);
    const settings = await this.modifyData(data);
    return settings;
  }

  async findMultipleSettings(global_setting_type_id: number) {
    return this.globalSettingsRepository.findMultipleSettings(
      global_setting_type_id,
    );
  }
  async modifyData(data: any) {
    let settings = {};
    data.forEach((patch) => {
      const obj = {
        [patch.key]: patch.value,
      };
      settings = { ...settings, ...obj };
    });

    return settings;
  }

  async createAndUpdate(
    query: GlobalSettingsQueryModel,
    body: GlobalSettingsModel,
  ) {
    const where: FindOptionsWhere<GlobalSettings> = {
      ...query,
    };
    const data = await this.globalSettingsRepository.findByCondition(where);
    if (!data) {
      // create date
      const payload: CreateGlobalSettingsDto = {
        ...query,
        value: body.value,
        sequence: 1,
        record_status: RecordStatus.ACTIVE,
        value_datatype:
          GlobalSettingsValuesDatatype[(typeof body.value).toUpperCase()],
      };
      return this.globalSettingsRepository.create(payload);
    }
    return this.globalSettingsRepository.findAndUpdate(data.id, body);
  }
}
