import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableModifyObserviumAlertAddIndex1696938642019
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX idx_alert_severity ON observium_alert (alert_severity)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
