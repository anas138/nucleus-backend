import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class DumpDropDown1734089561983 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('drop_down_items-1734089754.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
