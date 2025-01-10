import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();

export class RestoreAlarmsConfig1694785010096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('dev_alarms_config_data-1694785010096.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
