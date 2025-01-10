import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DropDownCategory } from 'src/entities/drop-down-category.entity';
import { FindOptionsWhere, QueryResult, Repository } from 'typeorm';

export class DropDownRepository {
  constructor(
    @InjectRepository(DropDownCategory)
    private readonly dropDownCategoryRepo: Repository<DropDownCategory>,
  ) {}

  async findByConditionWithRelations(
    filterCondition: FindOptionsWhere<DropDownCategory>,
    relations: string[],
  ) {
    return this.dropDownCategoryRepo.findOne({
      where: filterCondition,
      relations,
    });
  }

  async getDropDownItemsByName(
    category_constant: string,
    status: string | number,
  ) {
    const query = await this.dropDownCategoryRepo
      .createQueryBuilder('drop_down_category')
      //.select(['drop_down_category']) // added selection
      .leftJoinAndSelect('drop_down_category.dd_items', 'drop_down_item')
      .andWhere('drop_down_category.constant =:constant', {
        constant: category_constant,
      })
      .andWhere('drop_down_item.label=:name OR drop_down_item.id=:name', {
        name: status,
      })
      .getOne();

    return query.dd_items[0];
  }
}
