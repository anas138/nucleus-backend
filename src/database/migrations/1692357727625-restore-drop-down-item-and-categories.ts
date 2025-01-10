import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();

export class RestoreDropDownItemAndCategories1692357727625
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'drop-down-categories-and-items-nucleus_listener-202308181618.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
