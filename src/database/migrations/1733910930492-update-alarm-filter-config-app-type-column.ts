import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAlarmFilterConfigAppTypeColumn1733910930492
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
           ALTER TABLE alarm_filter_config
           MODIFY COLUMN app_type ENUM('NCE','OBSERVIUM','NCE_GPON','NOKIA_TXN','LDI_SOFTSWITCH_EMS') NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
