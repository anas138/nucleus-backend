import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDownItem1729660093262 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('restore_drop_down_item-1729660396.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
