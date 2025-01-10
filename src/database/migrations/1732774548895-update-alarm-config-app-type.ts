import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAlarmConfigAppType1732774548895
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
           ALTER TABLE alarm_filter_config
           MODIFY COLUMN app_type ENUM('NCE','OBSERVIUM','NCE_GPON','NOKIA_TXN') NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
