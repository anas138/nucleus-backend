import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAlarmConfigAppTypeColumn1730956687956
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
           ALTER TABLE alarm_filter_config
           MODIFY COLUMN app_type ENUM('NCE', 'OBSERVIUM', 'NOKIA', 'NCE_GPON') NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}