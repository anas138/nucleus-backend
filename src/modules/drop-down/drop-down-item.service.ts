import { Injectable } from '@nestjs/common/decorators';
import { DropDownCategory } from 'src/entities/drop-down-category.entity';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { DropDownRepository } from './drop-down.repository';
import { DropDownItem } from 'src/entities/drop-down-item.entity';
@Injectable()
export class DropDownItemsService {
  constructor(private readonly repo: DropDownRepository) {}

  async getDropDownItemsByCategory(
    category_constant?: string,
    category_id?: number,
  ): Promise<DropDownItem[]> {
    const where: FindOptionsWhere<DropDownCategory> = category_constant
      ? { constant: category_constant }
      : { id: category_id };
    const relations = ['dd_items'];
    const dropDownCategory = await this.repo.findByConditionWithRelations(
      where,
      relations,
    );
    if (dropDownCategory) {
      return dropDownCategory.dd_items;
    }
    return [];
  }

  async getDropDownItemsByName(category_constant, id: number | string) {
    const query = await this.repo.getDropDownItemsByName(category_constant, id);
    return query;
  }
}
