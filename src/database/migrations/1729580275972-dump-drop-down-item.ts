import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class DumpDropDownItem1729580275972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('dump_drop_down_items-1729582316.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}