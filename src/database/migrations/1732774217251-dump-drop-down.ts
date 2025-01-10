import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class DumpDropDown1732774217251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('dump-drop-down-1732774397.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
