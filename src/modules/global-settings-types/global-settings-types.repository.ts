import { InjectRepository } from '@nestjs/typeorm';
import { GlobalSettingsTypes } from 'src/entities/global-setting-types.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';

export class GlobalSettingsTypesRepository extends BaseAbstractRepository<GlobalSettingsTypes> {
  constructor(
    @InjectRepository(GlobalSettingsTypes)
    private readonly globalSettingsTypesRepository: Repository<GlobalSettingsTypes>,
  ) {
    super(globalSettingsTypesRepository);
  }
}
