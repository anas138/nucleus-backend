import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { GlobalSettings } from 'src/entities/global-settings.entity';

export class GlobalSettingsRepository extends BaseAbstractRepository<GlobalSettings> {
  constructor(
    @InjectRepository(GlobalSettings)
    private readonly globalSettingsRepository: Repository<GlobalSettings>,
  ) {
    super(globalSettingsRepository);
  }

  async findMultipleSettings(global_setting_type_id: number) {
    const query = await this.globalSettingsRepository
      .createQueryBuilder('global_settings')
      .select([
        'global_settings.id',
        'global_settings.condition_value',
        'global_settings.key',
        'global_settings.value',
        'global_settings.value_datatype',
      ])
      //.leftJoin('global_settings.globalSettingsType', 'global_settings_types')
      .where('global_settings.global_setting_type_id = :name', {
        name: `${global_setting_type_id}`,
      })
      .getMany();
    return query;
  }

  async findAndUpdate(id: any, body: any) {
    const settings = await this.globalSettingsRepository.findOne({
      where: { id: id },
    });
    const update = await this.globalSettingsRepository.save({
      ...settings,
      value: body.value,
    });
    return { [update.key]: update.value };
  }
}
