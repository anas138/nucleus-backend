import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropdownItemCategoriesAddPriorities1728293757709
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('restore_drop_down_cat_and_items-1728293616.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
