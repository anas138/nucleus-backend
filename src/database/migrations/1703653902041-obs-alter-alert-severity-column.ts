import { MigrationInterface, QueryRunner } from 'typeorm';

export class ObsAlterAlertSeverityColumn1703653902041
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE observium_alert
        MODIFY COLUMN alert_severity ENUM('Critical', 'Warning', 'Notification');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
