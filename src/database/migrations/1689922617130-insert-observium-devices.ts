import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();
export class InsertObserviumDevices1689922617130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'observium-device-nucleus_listener-202307211437.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
