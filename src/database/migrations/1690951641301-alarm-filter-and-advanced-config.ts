import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();

export class AlarmFilterAndAdvancedConfig1690951641301
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'restore-alarm-filter-config-advance-conditions-and-recipients-dev_nucleus_db-202309121505.sql',
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
