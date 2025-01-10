import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();
export class InsertRegions1697785919798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'RegionDump-nucleus_listener-202310200009.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
