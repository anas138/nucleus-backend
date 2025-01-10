import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
const helperFunctions = new HelperFunctions();
export class RestoreDropDownItem1711526829177 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('drop_down_v2-1711508724.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
