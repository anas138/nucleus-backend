import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDownItems1711428751324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('drop_down_item-1711410897.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
