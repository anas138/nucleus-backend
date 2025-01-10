import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';

const helperFunctions = new HelperFunctions();

export class RestoreDropDownItems1726487856729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('restore_drop_down_items-1726487776.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
