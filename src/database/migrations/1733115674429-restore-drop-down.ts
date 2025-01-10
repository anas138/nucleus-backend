import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDown1733115674429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('restore_drop_down-1733115597.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
