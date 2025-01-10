import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDownItem1713259462360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('restore_drop_down_item-1713153716.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
