import { BaseAbstractRepository } from './base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FiltersTemplate } from 'src/entities/filters-template';
import { Repository } from 'typeorm';

export class FiltersTemplateRepository extends BaseAbstractRepository<FiltersTemplate> {
  constructor(
    @InjectRepository(FiltersTemplate)
    private readonly filtersTemplateRepository: Repository<FiltersTemplate>,
  ) {
    super(filtersTemplateRepository);
  }

  async deleteFiltersTemplate(filterTemplate: FiltersTemplate) {
    return this.filtersTemplateRepository.delete(filterTemplate.id);
  }
}
