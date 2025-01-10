import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { TroubleTicketCategory } from 'src/entities/trouble-ticket-catagory.entity';
import { TroubleTicketCategoryRepository } from './trouble-ticket-category.repositroy';
import { FindManyOptions, FindOptionsWhere, IsNull } from 'typeorm';
import { APP_MESSAGES, RecordStatus } from 'src/common/enums/enums';
import { HelperFunctions } from 'src/common/util/helper-functions';

const helperFunctions = new HelperFunctions();
@Injectable()
export class TroubleTicketCategoryService extends BaseService<TroubleTicketCategory> {
  constructor(
    private readonly troubleTicketCategoryRepository: TroubleTicketCategoryRepository,
  ) {
    super(troubleTicketCategoryRepository);
  }

  async checkDuplicate(name: string, parent_id?: number) {
    const where: FindOptionsWhere<TroubleTicketCategory> = {
      name: name,
      parent_id: parent_id,
    };
    const ifExists = await this.findByCondition(where);
    if (ifExists) {
      throw new BadRequestException(
        APP_MESSAGES.TROUBLE_TICKET_CATEGORY.ERROR_DUPLICATE,
      );
    }
    return true;
  }

  async getCategories() {
    const where: FindManyOptions<TroubleTicketCategory> = {
      where: { parent_id: IsNull() },
    };
    return this.troubleTicketCategoryRepository.findAll(where);
  }

  async getTroubleTicketById(id: number) {
    const where: FindOptionsWhere<TroubleTicketCategory> = {
      id: id,
    };
    const relation = ['sub_category'];
    return this.findByCondition(where, null, relation);
  }

  async getCalculation(id: number) {
    const categoryId = id;
    const ticketCategory = await this.getTroubleTicketById(categoryId);
    const tat = ticketCategory.tat;
    const tatType = ticketCategory.tat_uom;
    return helperFunctions.calculateStartEndTime(tat, tatType);
  }
}
