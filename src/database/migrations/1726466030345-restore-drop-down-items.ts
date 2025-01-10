import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDownItems1726466030345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('restore_drop_down_items-1726465916.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
