import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableModifyObsAlertAddIndex1696402134602
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX idx_alert_timestamp ON observium_alert (alert_timestamp)
    `);
    await queryRunner.query(`
        CREATE INDEX idx_cleared_on ON observium_alert (cleared_on)
    `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
