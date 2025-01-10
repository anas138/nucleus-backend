import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDownCategory1704349753191
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'restore_drop_down_category_and_drop_down_item-1704331451.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
