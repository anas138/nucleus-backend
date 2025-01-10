import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { GlobalSettingsTypes } from 'src/entities/global-setting-types.entity';
import { GlobalSettingsTypesRepository } from './global-settings-types.repository';

@Injectable()
export class GlobalSettingsTypesService extends BaseService<GlobalSettingsTypes> {
  constructor(
    private readonly globalSettingsTypesRepository: GlobalSettingsTypesRepository,
  ) {
    super(globalSettingsTypesRepository);
  }
}
