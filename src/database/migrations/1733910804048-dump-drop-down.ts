import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class DumpDropDown1733910804048 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('dump_drop_down-1733911109.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
