import { Injectable, NotFoundException } from '@nestjs/common';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { BaseService } from 'src/common/services/base.service';
import { FiltersTemplate } from 'src/entities/filters-template';
import { User } from 'src/entities/user.entity';
import { CreateFiltersTemplateModel } from 'src/models/filters-template.model';
import { FiltersTemplateRepository } from 'src/repositories/filters-template.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class FiltersTemplateService extends BaseService<FiltersTemplate> {
  constructor(
    private readonly filtersTemplateRepository: FiltersTemplateRepository,
  ) {
    super(filtersTemplateRepository);
  }

  async createFilterTemplate(
    userId: number,
    body: CreateFiltersTemplateModel,
  ): Promise<FiltersTemplate> {
    return await this.filtersTemplateRepository.create({
      user_id: userId,
      ...body,
    });
  }

  async deleteFiltersTemplateById(userId, FiltersTemplateId) {
    const filtersTemplateToDelete =
      await this.filtersTemplateRepository.findByCondition({
        user: userId,
        id: FiltersTemplateId,
      });

    if (filtersTemplateToDelete) {
      // Delete the entity
      return await this.filtersTemplateRepository.deleteFiltersTemplate(
        filtersTemplateToDelete,
      );
    } else {
      throw new NotFoundException(
        APP_MESSAGES.FILTERS_TEMPLATES.ERROR_FILTERS_TEMPLATE_NOT_FOUND,
      );
    }
  }
}
