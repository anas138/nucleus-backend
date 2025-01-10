import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';
const helperFunctions = new HelperFunctions();

export class RestoreDropdownItemsCategories1709805718185
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('dropdown-categoies-and-items-20240307.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
