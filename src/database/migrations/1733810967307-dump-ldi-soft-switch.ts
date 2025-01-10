import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class DumpLdiSoftSwitch1733810967307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('ldi_softswitch_trunk_group-1733810871.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
