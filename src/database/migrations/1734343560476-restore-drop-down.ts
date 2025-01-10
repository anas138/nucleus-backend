import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDown1734343560476 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('restore-drop-down-items-1734343991.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
